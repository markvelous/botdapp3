require('babel-register');
require('babel-polyfill');

// For linking to Rinkeby
const { projectId, mnemonic } = require('./secrets.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://eth-rinkeby.alchemyapi.io/v2/${projectId}`),
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
      confirmations: 2,   
      timeoutBlocks: 200,
      skipDryRun: true
      },
      
  },

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
};