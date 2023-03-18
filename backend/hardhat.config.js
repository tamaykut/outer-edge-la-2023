require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },

  networks: {
    hardhat: {
      chainId: 1337,
    },

    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      // gas: 300000000,
      // gasPrice: 100000000000,
      saveDeployments: true,
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      saveDeployments: true,
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      saveDeployments: true,
    },
    xdai: {
      url: process.env.XDAI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      saveDeployments: true,
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      gas: 200000000,
      gasPrice: 100000000000,
      saveDeployments: true,
    },
  },
  gasReporter: {
    enabled: true,
    currency: 'USD', //ETH USD
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: process.env.CMC_KEY,
   // gasPrice: 21,
    gasPriceApi: https://api.etherscan.io/api?module=proxy&action=eth_gasPrice,
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};


