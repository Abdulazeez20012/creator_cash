// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node`.
const hre = require("hardhat");

async function main() {
  // Get the ContractFactory for our CreatorCashMarketplace contract
  const CreatorCashMarketplace = await hre.ethers.getContractFactory("CreatorCashMarketplace");
  
  // Deploy the contract
  console.log("Deploying CreatorCashMarketplace...");
  const creatorCashMarketplace = await CreatorCashMarketplace.deploy();
  
  // Wait for the deployment transaction to be mined
  await creatorCashMarketplace.deployed();
  
  console.log("CreatorCashMarketplace deployed to:", creatorCashMarketplace.address);
  
  // Verify the contract on Hedera if needed
  // Note: Contract verification steps would go here if using a block explorer
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });