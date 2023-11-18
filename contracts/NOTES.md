
## Deployment
yarn hardhat run  scripts/deploy.ts  --network gnosis

## Verification
yarn hardhat verify --network gnosis --contract contracts/composable/SBCDepositContract.sol:SBCDepositContract 0xdA197550746757e0923F4F29892e6974c69326A2 0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d

yarn hardhat verify  --network gnosis --contract contracts/composable/SBCDepositContractMock.sol:SBCDepositContractMock 0xF07AFCEe9dD0B859edD41603A3D725b70086fEF6 0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d 1000000000000000

---

yarn hardhat run scripts/deployTransferBalanceContract.ts --network gnosis

yarn hardhat verify  --network gnosis --contract contracts/TransferBalance.sol:TransferBalance 0xD4121d2d90CE7C5F7FB66c4E96815fc377481635
