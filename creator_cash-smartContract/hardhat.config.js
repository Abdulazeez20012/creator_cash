require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// This is a sample Hardhat network configuration for Hedera
// You'll need to replace with actual Hedera network details
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Hedera Testnet configuration
    "hedera-testnet": {
      url: "https://testnet.hashio.io/api",
      accounts: [process.env.PRIVATE_KEY || "0x0b60924f04040266883ac7b771141b9fb86f49548c439051526cc8442421b8fc"],
      chainId: 296,
      gas: "auto",
      gasPrice: "auto"
    }
}};