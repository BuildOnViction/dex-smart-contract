/**
 * @description Fails if the input promise is not rejected with an Invalid opcode message
 * @param promise
 */
export const expectInvalidOpcode = async (promise) => {
  try {
    await promise
  } catch (error) {
    expect(error.message).to.include('invalid opcode')
    return
  }
  expect.fail('Expected throw not received')
}

/**
 * @description Fails if the input promise is not rejected with a Revert message
 * @param promise
 */
export const expectRevert = async (promise) => {
  try {
    await promise
  } catch (error) {
    expect(error.message).to.include('revert')
    return
  }
  expect.fail('Expected revert not received')
}

/**
 * @description Fails if the input promise is not reject with an Invalid jump message
 * @param promise
 */
export const expectInvalidJump = async (promise) => {
  try {
    await promise
  } catch (error) {
    expect(error.message).to.include('invalid JUMP')
    return
  }
  expect.fail('Expected throw not received')
}

/**
 * @description Fails if the input promise is not rejected with an Out of Gas message
 * @param promise
 */
export const expectOutOfGas = async (promise) => {
  try {
    await promise
  } catch (error) {
    expect(error.message).to.include('out of gas')
    return
  }
  expect.fail('Expected throw not received')
}

/**
 * @description Mine the local evm
 * @returns promise
 */
export const advanceBlock = (web3) => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_mine',
      id: Date.now(),
    }, (err, res) => {
      return err ? reject(err) : resolve(err)
    })
  })
}

export const advanceNBlocks = async(web3, number) => {
  let initialBlockNumber = await web3.eth.getBlockNumber()
  let blockNumber = initialBlockNumber
  if (number < 0) {
    throw Error(`number should be a strictly positive number`)
  }

  while(blockNumber < initialBlockNumber + number) {
    await advanceBlock(web3)
    blockNumber = await web3.eth.getBlockNumber()
  }
}