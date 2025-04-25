const { ethers } = require("hardhat");

async function main() {
  // Deploy the AuctionFactory contract
  const AuctionFactory = await ethers.getContractFactory("AuctionFactory");
  const auctionFactory = await AuctionFactory.deploy();
  
  await auctionFactory.deployed();
  
  console.log("AuctionFactory deployed to:", auctionFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
