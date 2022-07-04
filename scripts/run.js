const main = async () => {
  const contractFac = await hre.ethers.getContractFactory('Nft')
  const contract = await contractFac.deploy()

  await contract.deployed()
  console.log('Deployed to: ', contract.address)

  let txn = await contract.mint()
  await txn.wait()

  txn = await contract.mint()
  await txn.wait()
  txn = await contract.mint()
  await txn.wait()
  txn = await contract.mint()
  await txn.wait()
  txn = await contract.mint()
  await txn.wait()
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

runMain() 