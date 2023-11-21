import { ethers } from "ethers";
import { HookBuilder } from "./appData";
import { generateOrderSalt } from "./utils";
import { CLAIM_AND_SWAP_CONTRACT, COW_API } from "./constants";
import { AppData } from "./types";

/// WXDAI
const CLAIM_TOKEN_ADDRESS = "0xe91d153e0b41518a2ce8dd3d7944fa863463a97d";
/// COW on Gnosis Chain
const BUY_TOKEN_ADDRESS = "0x177127622c4A00F3d409B75571e12cB3c8973d3c";

/// OUR MOCK Deposit Contract
const CLAIM_CONTRACT_ADDRESS = "0xf07afcee9dd0b859edd41603a3d725b70086fef6";

const SAFE_ADDRESS = "0x608Acd7d1c01439b351FEfAFf7636A136aF3Da81";

async function safeOnlyAppData(
  provider: ethers.providers.JsonRpcProvider,
  safeAddress: string,
  claimContractAddress: string
): Promise<AppData> {
  let builder = new HookBuilder(provider, COW_API);
  let appData = builder.generateAppData(
    [await builder.permissionlessClaimHook(safeAddress, claimContractAddress)],
    []
  );
  await builder.postAppData(appData);
  return appData;
}

async function buildCreateOrderData() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NODE_URL || "https://rpc.gnosischain.com/"
  );
  const { hash: appDataHash } = await safeOnlyAppData(
    provider,
    SAFE_ADDRESS,
    CLAIM_CONTRACT_ADDRESS
  );
  const staticOrderData = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "address", "bytes32"],
    [CLAIM_TOKEN_ADDRESS, BUY_TOKEN_ADDRESS, SAFE_ADDRESS, appDataHash]
  );

  const params = [
    // handlerAddress
    CLAIM_AND_SWAP_CONTRACT,
    generateOrderSalt(),
    staticOrderData,
  ];

  console.log("params", params);
}

buildCreateOrderData();
