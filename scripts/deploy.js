const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy IdentityRegistry
  const IdentityRegistry = await hre.ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy();
  await identityRegistry.waitForDeployment();
  const identityRegistryAddress = await identityRegistry.getAddress();
  console.log("IdentityRegistry deployed to:", identityRegistryAddress);

  // Deploy PolicyContract
  const PolicyContract = await hre.ethers.getContractFactory("PolicyContract");
  const policyContract = await PolicyContract.deploy();
  await policyContract.waitForDeployment();
  const policyContractAddress = await policyContract.getAddress();
  console.log("PolicyContract deployed to:", policyContractAddress);

  // Deploy ClaimContract
  const ClaimContract = await hre.ethers.getContractFactory("ClaimContract");
  const claimContract = await ClaimContract.deploy();
  await claimContract.waitForDeployment();
  const claimContractAddress = await claimContract.getAddress();
  console.log("ClaimContract deployed to:", claimContractAddress);

  // Save deployment addresses
  const fs = require("fs");
  const deploymentInfo = {
    network: "localhost",
    chainId: 1337,
    contracts: {
      IdentityRegistry: identityRegistryAddress,
      PolicyContract: policyContractAddress,
      ClaimContract: claimContractAddress,
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    "./deployments.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\nDeployment addresses saved to deployments.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

