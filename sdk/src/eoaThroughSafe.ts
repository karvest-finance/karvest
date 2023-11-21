import { ethers } from "ethers";
import { generateOrderSalt } from "./utils";
import { AppData, HookBuilder } from "./appData";
import {
  COW_API,
  GNO_CLAIM_CONTRACT_ADDRESS,
  CLAIM_AND_SWAP_CONTRACT,
  GNO_TOKEN_ADDRESS,
} from "./constants";

/// COW on Gnosis Chain
const BUY_TOKEN_ADDRESS = "0x177127622c4A00F3d409B75571e12cB3c8973d3c";
const SAFE_ADDRESS = "0x608Acd7d1c01439b351FEfAFf7636A136aF3Da81";

async function generateMixedEoaSafeAppData(
  provider: ethers.providers.JsonRpcProvider,
  eoaAddress: string,
  safeAddress: string,
  claimContractAddress: string,
  claimTokenAddress: string
): Promise<AppData> {
  let builder = new HookBuilder(provider, COW_API);
  // TODO - EOA permit SAFE via set allowance and encode transfer from hook.
  let preHooks = await Promise.all([
    builder.permissionlessClaimHook(safeAddress, claimContractAddress),
    builder.transferBalanceFromHook(claimTokenAddress, eoaAddress, safeAddress),
  ]);
  let appData = await builder.generateAppData(preHooks, []);
  await builder.postAppData(appData);
  return appData;
}

async function buildCreateOrderData() {
  const eoaAddress = process.env.ETH1_WITHDRAW_ADDRESS;
  if (eoaAddress === undefined)
    throw Error("Invalid env var ETH1_WITHDRAW_ADDRESS");
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NODE_URL || "https://rpc.gnosischain.com/"
  );
  const appData = await generateMixedEoaSafeAppData(
    provider,
    eoaAddress,
    SAFE_ADDRESS,
    GNO_CLAIM_CONTRACT_ADDRESS,
    GNO_TOKEN_ADDRESS
  );
  const staticOrderData = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "address", "bytes32"],
    [GNO_CLAIM_CONTRACT_ADDRESS, BUY_TOKEN_ADDRESS, SAFE_ADDRESS, appData.hash]
  );

  const params = [
    // handlerAddress
    CLAIM_AND_SWAP_CONTRACT,
    // Order Salt
    generateOrderSalt(),
    staticOrderData,
  ];

  console.log("params", params);
}

buildCreateOrderData();
