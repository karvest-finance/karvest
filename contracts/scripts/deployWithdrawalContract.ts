import { ethers } from "hardhat";

async function main() {
    const [ deployer ] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    // GNOSIS CHAIN
    const wxDai = "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d";
    const amount = ethers.parseEther("0.001");
    const deposit = await ethers.deployContract("SBCDepositContractMock", [wxDai, amount]);
    await deposit.waitForDeployment();
    console.log(`SBCDepositContractMock deployed to ${deposit.target}`);

    const claimable = await deposit.withdrawableAmount(deployer.address);
    console.log(`Withdrawable amount: ${claimable}`);

    // const factory = await ethers.getContractFactory("SBCWithdrawalContractMock", deployer)
    // factory.attach(deposit.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
