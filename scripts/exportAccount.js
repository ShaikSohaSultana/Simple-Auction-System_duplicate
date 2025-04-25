const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Hardhat's first account
  const wallet = new ethers.Wallet(privateKey);
  const password = "MySecurePass123!"; // Replace with a strong password
  const jsonKeystore = await wallet.encrypt(password);
  fs.writeFileSync("account.keystore.json", jsonKeystore);
  console.log("Keystore file saved as account.keystore.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });