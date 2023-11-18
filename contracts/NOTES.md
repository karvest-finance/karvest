
## Deployment
yarn hardhat run  scripts/deploy.ts  --network gnosis

## Verification
yarn hardhat verify --network gnosis --contract contracts/composable/SBCDepositContract.sol:SBCDepositContract 0xdA197550746757e0923F4F29892e6974c69326A2 0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d
