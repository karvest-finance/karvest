import { BigNumber, ethers } from "ethers";

export type AppData = {
  hash: string;
  data: string;
};

export type CowHook = {
  target: string;
  callData: string;
  gasLimit: string;
};

export type PermitHookParams = {
  // EOA wallet must be used to sign permit.
  // TODO - support Multisig wallet.
  wallet: ethers.Wallet;
  tokenAddress: string;
  spender: string;
  amount: BigNumber;
};
