require('babel-register');
require('babel-polyfill');
require('dotenv').config();
require('truffle-hdwallet-provider')

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
  },

  /*
  const HDWalletProvider = require('truffle-hdwallet-provider')

  rinkeby: {
    provider: (new HDWalletProvider(PRIVATE_KEY, API_URL)),
    network_id: 4,
    gas: 4500000,
    gasPrice: 10000000000,
    confirmations: 2,   
    timeoutBlocks: 200,
    skipDryRun: true
  }
  */

  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
