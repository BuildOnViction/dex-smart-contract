import {soliditySha3 as keccak256} from 'web3-utils'

export const getOrderHash = (exchange, order) => {
    return keccak256(
        exchange.address,
        order.userAddress,
        order.baseToken,
        order.quoteToken,
        order.amount,
        order.pricepoint,
        order.side,
        order.salt,
        order.feeMake,
        order.feeTake
    )
};

export const getMatchOrderValues = (makerOrder, takerOrder) => {
    return [
        makerOrder.amount,
        makerOrder.pricepoint,
        makerOrder.side,
        makerOrder.salt,
        takerOrder.amount,
        takerOrder.pricepoint,
        takerOrder.side,
        takerOrder.salt,
        makerOrder.feeTake, //supposed to be the same for both orders
        makerOrder.feeMake //supposed to be the same for both orders
    ]
};

export const getMatchOrderAddresses = (makerOrder, takerOrder) => {
    return [
        makerOrder.userAddress,
        takerOrder.userAddress,
        makerOrder.baseToken, //supposed to be the same for both orders
        makerOrder.quoteToken  //supposed to be the same for both orders
    ]
};


export const getCancelOrderValues = (order) => {
    return [
        order.amount,
        order.nonce,
        order.feeMake,
        order.feeTake
    ]
};

export const getCancelOrderAddresses = (order) => {
    return [
        order.tokenBuy,
        order.tokenSell,
        order.maker
    ]
};