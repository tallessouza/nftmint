
const main = async () => {
  const fac = await hre.ethers.getContractFactory('Nft')
  const contract = await fac.deploy()
  await contract.deployed()
  console.log("Deployed to:", contract.address)

}
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();