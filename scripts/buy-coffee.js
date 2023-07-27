// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`The address ${idx} has a balance of: `, await getBalance(address));
    idx++;
  }
}

async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: '${message}'`);
  }
}

async function main() {
  const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();

  const BuyMeACoffee = await hre.ethers.getContractFactory('BuyMeACoffee');
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log(`The BuyMeACoffee contract was deployed at the address: ${buyMeACoffee.address}`);

  const addresses = [owner.address, tipper1.address, buyMeACoffee.address];
  await printBalances(addresses);

  const tip = {value: hre.ethers.utils.parseEther('1.0000')};
  await buyMeACoffee.connect(tipper1).buyCoffee("A", "Good Morning! I'm A", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("B", "Good Evening! I'm B", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("C", "Good Night! I'm C", tip);

  await printBalances(addresses);

  await buyMeACoffee.connect(owner).withdrawTips();

  await printBalances(addresses);

  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
