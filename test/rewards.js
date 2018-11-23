/* global  artifacts:true, web3: true, contract: true */
import chaiAsPromised from 'chai-as-promised'
import chai from 'chai'
import { expectRevert, advanceToBlock, computeEpoch } from './helpers'

chai.use(chaiAsPromised)
.use(require('chai-bignumber')(web3.BigNumber))
.should()

const RewardPools = artifacts.require('./RewardPools.sol')
const RewardCollector = artifacts.require('./RewardCollector.sol')
const ProofToken = artifacts.require('./tokens/ProofToken.sol')
const TUSD = artifacts.require('./tokens/TUSD.sol')
const DAI = artifacts.require('./tokens/DAI.sol')

contract('Rewards', (accounts) => {
  let proofToken, rewardCollector, rewardPools, dai, tusd
  let blocksPerEpoch

  let fund = accounts[0]
  let wallet = accounts[1]
  let wallet2 = accounts[2]
  let wallet3 = accounts[3]
  let wallet4 = accounts[4]

  let creationBlockNumber, epoch1, epoch2, epoch3, epoch4, epoch5

  beforeEach(async() => {
    blocksPerEpoch = 20
  })

  describe('Receive rewards', async() => {
    beforeEach(async() => {
      // We mint 1000 tokens and transfer half of them to the testing wallet address
      let mintedTokens = 10000000000e18

      proofToken = await ProofToken.new()
      await proofToken.mint(fund, 1000)

      rewardCollector = await RewardCollector.new(proofToken.address)
      rewardPools = await RewardPools.new(proofToken.address, rewardCollector.address)
      tusd = await TUSD.new(fund, mintedTokens)
      dai = await DAI.new(fund, mintedTokens)

      await rewardPools.registerQuoteToken(tusd.address)
      await rewardPools.registerQuoteToken(dai.address)
      await rewardCollector.setRewardPools(rewardPools.address)

      await proofToken.transfer(wallet, 250, { from: fund })
      await proofToken.transfer(wallet2, 250, { from: fund })
      await proofToken.transfer(wallet3, 250, { from: fund })
      await proofToken.transfer(wallet4, 250, { from: fund })

      creationBlockNumber = await rewardPools.creationBlockNumber.call()
      epoch1 = creationBlockNumber.plus(blocksPerEpoch).toNumber()
      epoch2 = creationBlockNumber.plus(2 * blocksPerEpoch).toNumber()
      epoch3 = creationBlockNumber.plus(3 * blocksPerEpoch).toNumber()
      epoch4 = creationBlockNumber.plus(4 * blocksPerEpoch).toNumber()
      epoch5 = creationBlockNumber.plus(5 * blocksPerEpoch).toNumber()
    })

    it('should update the reward collector token balance when transferring tokens', async() => {
      await tusd.transfer(rewardCollector.address, 500, { from: fund })

      let rewardCollectorBalance = await tusd.balanceOf(rewardCollector.address)
      rewardCollectorBalance.should.be.bignumber.equal(500)
    })

    it('should update the reward collector token balance when transferring tokens (with TransferFrom)', async() => {
      await tusd.approve(wallet, 500, { from: fund })
      await tusd.transferFrom(fund, rewardCollector.address, 500, { from: wallet })

      let rewardCollectorBalance = await tusd.balanceOf(rewardCollector.address)
      rewardCollectorBalance.should.be.bignumber.equal(500)
    })

    it('should not transfer tokens to withdrawRewards caller if the epoch is not finished', async() => {
      await tusd.transfer(rewardCollector.address, 1000, { from: fund })
      await expectRevert(rewardPools.withdrawRewards({ from: wallet }))

      let walletTUSDBalance = await tusd.balanceOf(wallet)
      walletTUSDBalance.should.be.bignumber.equal(0)
    })

    it('should transfer tokens to first pool but not to caller if withdrawRewards is called during epoch1', async() => {
      await tusd.transfer(rewardCollector.address, 1000, { from: fund })

      await advanceToBlock(epoch1)
      await rewardPools.withdrawRewards({ from: wallet })

      let walletTUSDBalance = await tusd.balanceOf(wallet)
      let rewardPoolsContractTUSDBalance = await tusd.balanceOf(rewardPools.address)
      let rewardPoolsFirstPoolBalance = await rewardPools.balanceOfPool.call(0, tusd.address)
      let rewardPoolsSecondPoolBalance = await rewardPools.balanceOfPool.call(1, tusd.address)
      let rewardPoolsThirdPoolBalance = await rewardPools.balanceOfPool.call(2, tusd.address)

      walletTUSDBalance.should.be.bignumber.equal(0)
      rewardPoolsContractTUSDBalance.should.be.bignumber.equal(1000)
      rewardPoolsFirstPoolBalance.should.be.bignumber.equal(1000)
    })

    it('should transfer tokens to first pool and partially to caller if withdrawRewards 1', async() => {
      await tusd.transfer(rewardCollector.address, 1000, { from: fund })

      await advanceToBlock(epoch2)
      await rewardPools.withdrawRewards({ from: wallet })

      let walletTUSDBalance = await tusd.balanceOf(wallet)
      let rewardPoolsContractTUSDBalance = await tusd.balanceOf(rewardPools.address)
      let rewardPoolsFirstPoolBalance = await rewardPools.balanceOfPool.call(0, tusd.address)
      let rewardPoolsSecondPoolBalance = await rewardPools.balanceOfPool.call(1, tusd.address)
      let rewardPoolsThirdPoolBalance = await rewardPools.balanceOfPool.call(2, tusd.address)

      walletTUSDBalance.should.be.bignumber.equal(250)
      rewardPoolsContractTUSDBalance.should.be.bignumber.equal(750)
      rewardPoolsFirstPoolBalance.should.be.bignumber.equal(0)
      rewardPoolsSecondPoolBalance.should.be.bignumber.equal(750)
    })

    it('should transfer tokens to first pool and partially to caller if withdrawRewards 2', async() => {
      await tusd.transfer(rewardCollector.address, 1000, { from: fund })
      await advanceToBlock(epoch2 + 1)
      await rewardPools.withdrawRewards({ from: wallet })

      await tusd.transfer(rewardCollector.address, 1000, { from: fund })
      await advanceToBlock(epoch3 + 1)
      await rewardPools.withdrawRewards({ from: wallet })

      let walletTUSDBalance = await tusd.balanceOf(wallet)
      let rewardPoolsContractTUSDBalance = await tusd.balanceOf(rewardPools.address)
      let rewardPoolsFirstPoolBalance = await rewardPools.balanceOfPool.call(0, tusd.address)
      let rewardPoolsSecondPoolBalance = await rewardPools.balanceOfPool.call(1, tusd.address)
      let rewardPoolsThirdPoolBalance = await rewardPools.balanceOfPool.call(2, tusd.address)

      walletTUSDBalance.should.be.bignumber.equal(500)
      rewardPoolsContractTUSDBalance.should.be.bignumber.equal(1500)
      rewardPoolsFirstPoolBalance.should.be.bignumber.equal(0)
      rewardPoolsSecondPoolBalance.should.be.bignumber.equal(750)
      rewardPoolsThirdPoolBalance.should.be.bignumber.equal(750)
    })

    it('should transfer all quote tokens to pools/widthrawers', async () => {
      await tusd.transfer(rewardCollector.address, 1000, { from: fund })
      await dai.transfer(rewardCollector.address, 1000, { from: fund })

      await advanceToBlock(epoch2 + 1)
      await rewardPools.withdrawRewards({ from: wallet })

      let walletTUSDBalance = await tusd.balanceOf(wallet)
      let walletDAIBalance = await dai.balanceOf(wallet)
      let rewardPoolsContractTUSDBalance = await tusd.balanceOf(rewardPools.address)
      let rewardPoolsContractDAIBalance = await dai.balanceOf(rewardPools.address)
      let firstPoolTUSDBalance = await rewardPools.balanceOfPool.call(0, tusd.address)
      let secondPoolTUSDBalance = await rewardPools.balanceOfPool.call(1, tusd.address)
      let firstPoolDAIBalance = await rewardPools.balanceOfPool.call(0, dai.address)
      let secondPoolDAIBalance = await rewardPools.balanceOfPool.call(1, dai.address)

      walletTUSDBalance.should.be.bignumber.equal(250)
      walletDAIBalance.should.be.bignumber.equal(250)
      rewardPoolsContractTUSDBalance.should.be.bignumber.equal(750)
      rewardPoolsContractDAIBalance.should.be.bignumber.equal(750)
      firstPoolTUSDBalance.should.be.bignumber.equal(0)
      secondPoolTUSDBalance.should.be.bignumber.equal(750)
      firstPoolDAIBalance.should.be.bignumber.equal(0)
      secondPoolDAIBalance.should.be.bignumber.equal(750)
    })

    it('address cannot receive his rewards twice for the same pool', async() => {
      await tusd.transfer(rewardCollector.address, 1000, { from: fund })

      await advanceToBlock(epoch2 + 1)
      await rewardPools.withdrawRewards({ from: wallet })

      let walletTUSDBalance = await tusd.balanceOf(wallet)
      let rewardPoolsContractTUSDBalance = await tusd.balanceOf(rewardPools.address)
      let firstPoolTUSDBalance = await rewardPools.balanceOfPool.call(0, tusd.address)
      let secondPoolTUSDBalance = await rewardPools.balanceOfPool.call(1, tusd.address)

      walletTUSDBalance.should.be.bignumber.equal(250)
      rewardPoolsContractTUSDBalance.should.be.bignumber.equal(750)
      firstPoolTUSDBalance.should.be.bignumber.equal(0)
      secondPoolTUSDBalance.should.be.bignumber.equal(750)

      await expectRevert(rewardPools.withdrawRewards({ from: wallet }))

      walletTUSDBalance.should.be.bignumber.equal(250)
      rewardPoolsContractTUSDBalance.should.be.bignumber.equal(750)
      firstPoolTUSDBalance.should.be.bignumber.equal(0)
      secondPoolTUSDBalance.should.be.bignumber.equal(750)
    })

    it('totalUserReward should return the correct due balance for a certain token', async () => {
      await tusd.transfer(rewardCollector.address, 1000, { from: fund })
      await advanceToBlock(epoch2 + 1)

      let userReward = await rewardPools.totalUserReward(wallet, tusd.address)
      userReward.should.be.bignumber.equal(250)
    })

    it('totalUserReward should return the correct due balance for a certain token (2 epochs)', async () => {
      await tusd.transfer(rewardCollector.address, 1000, { from: fund })
      await advanceToBlock(epoch2 + 1)

      await tusd.transfer(rewardCollector.address, 1000, { from: fund })
      await advanceToBlock(epoch3 + 1)

      let userReward = await rewardPools.totalUserReward(wallet, tusd.address)
      userReward.should.be.bignumber.equal(500)
    })

    it('totalUserReward should return the correct due balance for a certain token after a user withdraws rewards', async () => {
      await tusd.transfer(rewardCollector.address, 1000, { from: fund })
      await advanceToBlock(epoch2 + 1)

      await rewardPools.withdrawRewards({ from: wallet })

      await tusd.transfer(rewardCollector.address, 1000, { from: fund })
      await advanceToBlock(epoch3 + 1)

      let userReward = await rewardPools.totalUserReward(wallet, tusd.address)
      userReward.should.be.bignumber.equal(250)
    })
  })
})