import { ethers } from 'hardhat';

async function main() {
  console.log('🚀 Deploying ConfidentialCounter contract...');

  const [deployer] = await ethers.getSigners();
  console.log('📝 Deploying with account:', deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('💰 Account balance:', ethers.formatEther(balance), 'ETH');

  // Deploy ConfidentialCounter
  const ConfidentialCounter = await ethers.getContractFactory('ConfidentialCounter');
  const counter = await ConfidentialCounter.deploy();
  await counter.waitForDeployment();

  const address = await counter.getAddress();
  console.log('✅ ConfidentialCounter deployed to:', address);

  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    contract: 'ConfidentialCounter',
    address: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  console.log('\n📋 Deployment Info:');
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Wait for block confirmations
  console.log('\n⏳ Waiting for block confirmations...');
  await counter.deploymentTransaction()?.wait(5);
  console.log('✅ Contract confirmed!');

  return {
    counter: address,
  };
}

main()
  .then((addresses) => {
    console.log('\n🎉 Deployment successful!');
    console.log('Contract addresses:', addresses);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
