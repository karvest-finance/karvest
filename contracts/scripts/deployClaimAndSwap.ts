import { ethers } from "hardhat";

async function main() {
    const [ deployer ] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    // GNOSIS CHAIN
    const COMPOSABLE_COW_ADDRESS = "0xfdaFc9d1902f4e0b84f65F49f244b32b31013b74";
    const DEPOSIT_CONTRACT_ADDRESS = "0xF07AFCEe9dD0B859edD41603A3D725b70086fEF6";

    const claimAndSwap = await ethers.deployContract("ClaimAndSwap", [COMPOSABLE_COW_ADDRESS, DEPOSIT_CONTRACT_ADDRESS]);
    await claimAndSwap.waitForDeployment();
    console.log(`ClaimAndSwap deployed to ${claimAndSwap.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
