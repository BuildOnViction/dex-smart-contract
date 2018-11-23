/**
 * This scripts generates a list of currently deployed addresses in the addresses.json file
 * It is useful for testing and queries the tokens that are deployed in the Exchange.sol
 * contract
 * The scripts the AMP_DEX_PATH to be set
 */
const { queryContractAddresses } = require('../utils/helpers')

queryContractAddresses()