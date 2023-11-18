import { ethers } from "hardhat";

async function main() {
    const [ deployer ] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    const deposit = await ethers.deployContract("TransferBalance", []);
    await deposit.waitForDeployment();

    console.log(`TransferBalance deployed to ${deposit.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
