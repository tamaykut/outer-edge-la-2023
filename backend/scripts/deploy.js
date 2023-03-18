const hre = require("hardhat");
// const { Framework } = require("@superfluid-finance/sdk-core")
// require("dotenv").config()

async function main() {

  //Varibles
  const royalty = "500";
  const URI = "https://gateway.pinata.cloud/ipfs/QmVYvkZ8fmzx2fgbJi72RJHdSz8vJc4bzx69g33UAEmecK";
  const royaltyAddress = "0xe2b8651bF50913057fF47FC4f02A8e12146083B8";
  const fdaixAddress = '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f';

  const TOKEN = await hre.ethers.getContractFactory("NFTContract");
  const tokens = await TOKEN.deploy(royalty, URI, royaltyAddress, fdaixAddress);
  await tokens.deployed();
  console.log("Tokens Contract deployed to:", tokens.address);
  const receipt3 = await tokens.deployTransaction.wait();
  console.log("gasUsed:" , receipt3.gasUsed);

////////////////////////////////////////////////

// const provider = new hre.ethers.providers.JsonRpcProvider(
//   process.env.GOERLI_RPC_URL
// )

// const sf = await Framework.create({
//   chainId: (await provider.getNetwork()).chainId,
//   provider
// })

// const signers = await hre.ethers.getSigners()
// Getting the Goerli fDAIx Super Token object from the Framework object
    // This is fDAIx on goerli - you can change this token to suit your network and desired token addres
// const daix = await sf.loadSuperToken("fDAIx")
//console.log("DAIx address:", daix.address);

// let NFTdeployed = '0x556763B180dEEa80ddD29200D936b3787b9AaFF0';
// let host = '0xEB796bdb90fFA0f28255275e16936D25d3418603';
// let CFAv1 = '0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873';
// let daixAddress = '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f';

// // We get the contract to deploy
// const CallerContract = await hre.ethers.getContractFactory("Caller")
// //deploy the money router account using the proper host address and the address of the first signer
// const callerContract = await CallerContract.deploy(NFTdeployed, host, CFAv1, daixAddress)

// await callerContract.deployed()

// console.log("Caller Contract deployed to:", callerContract.address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

