# SBCDepositContract
```bash
yarn hardhat run  scripts/deploy.ts  --network gnosis

yarn hardhat verify  --network gnosis --contract contracts/composable/SBCDepositContractMock.sol:SBCDepositContractMock 0xF07AFCEe9dD0B859edD41603A3D725b70086fEF6 0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d 1000000000000000
```

# TransferBalance

```bash
yarn hardhat run scripts/deployTransferBalanceContract.ts --network gnosis

yarn hardhat verify  --network gnosis --contract contracts/TransferBalance.sol:TransferBalance 0xD4121d2d90CE7C5F7FB66c4E96815fc377481635
```

# ClaimAndSwap
```bash
yarn hardhat verify  --network gnosis --contract contracts/ClaimAndSwap.sol:ClaimAndSwap 0x6c14F0ef1d77fD9a2F43d6CF17ac6F255803aeD0 0xfdaFc9d1902f4e0b84f65F49f244b32b31013b74 0xF07AFCEe9dD0B859edD41603A3D725b70086fEF6
```
