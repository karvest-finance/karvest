import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TransferBalance", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deploy() {

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();
        
        const TransferBalance = await ethers.getContractFactory("TransferBalance");
        const transferBalance = await TransferBalance.deploy();

        return { transferBalance, owner, otherAccount };
    }

    describe("deploy contract", function () {
        it("Should set the right unlockTime", async function () {
            const { transferBalance, owner, otherAccount } = await loadFixture(deploy);
            console.log(transferBalance);
            // Not sure what to test at the moment, but this seems to imply the contract was deployed.
        });
    });
});
