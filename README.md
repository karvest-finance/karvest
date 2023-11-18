# Claim and Swap

This project combines [CoW Hooks](https://beta.docs.cow.fi/cow-protocol/reference/contracts/periphery/hooks-trampoline) with [Composable CoW](https://github.com/cowprotocol/composable-cow) into a Safe App for the purpose of Claiming/Harvesting Rewards (e.g. Gnosis Chain Validator, or Balancer Staking) and swapping (eventually restaking -- wiht post hooks) on cowswap.

# Installation & Deployment

## Safe App; An Interface for initializing Claim & Swap

```sh
cd app/
yarn install
yarn start
```


## Contracts

From the contracts directory:

### Deploy Swap and Claim Contract

```sh
yarn
yarn hardhat run  scripts/deployClaimAndSwap.ts --network gnosis
```

This contract is deployed and verified at [0x6c14F0ef1d77fD9a2F43d6CF17ac6F255803aeD0](https://gnosisscan.io/address/0x6c14F0ef1d77fD9a2F43d6CF17ac6F255803aeD0#code). It points to the [ComposableCow](https://gnosisscan.io/address/0xfdafc9d1902f4e0b84f65f49f244b32b31013b74) Contract, but uses a [MockSBCDepositContract](https://gnosisscan.io/address/0xf07afcee9dd0b859edd41603a3d725b70086fef6) (for the purpose of demo) which emits WXDAI instead of GNO.

## EOA Claim & Swap

[Sample Transaction](https://gnosisscan.io/tx/0xadacb7d0862c0f4f341edcfb4ab9746995ef609bb543cbfbccba62b7ef29824a)
    1. Claims Validator Rewards
    2. Swaps (not all but some) for COW token.

Env file requires `PRIVATE_KEY`

```sh
yarn
source .env
```

```sh
yarn run-eoa
```

## Generate and Post App Data

This library can also - Generate and POST new App Data (something that should happen before order creation via the Safe App). However, these methods are not exposed in script format at the moment. For this, refer to [eoaClaimAndSwap/AppData.ts](./eoaClaimAndSwap/src/appData.ts)



The ultimate goal is to implement Post Hooks that can "restake" the claimed GNO. This can be achieved by the user precreaating their validator keys and uploading them. The Validator's public key info is needed to invoke the deposit method, but can absolutely be generated via this Safe App / Post Composable Order compatible project.