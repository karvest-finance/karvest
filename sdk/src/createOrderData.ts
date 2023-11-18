import { ethers } from "ethers";
import { safeOnlyAppData } from "./appData";

/// WXDAI
const CLAIM_TOKEN_ADDRESS = "0xe91d153e0b41518a2ce8dd3d7944fa863463a97d";
/// COW on Gnosis Chain
const BUY_TOKEN_ADDRESS = "0x177127622c4A00F3d409B75571e12cB3c8973d3c";

/// OUR MOCK Deposit Contract
const CLAIM_CONTRACT_ADDRESS = "0xf07afcee9dd0b859edd41603a3d725b70086fef6";

const SAFE_ADDRESS = "0x608Acd7d1c01439b351FEfAFf7636A136aF3Da81";

const CLAIM_AND_SWAP_CONTRACT = "0x35f29f3cb53bddb11b6e286a0454a9224dd3adaa";


///
async function buildCreateOrderData() {
  // TODO - generate and post app data use hash below.
  const appData = await safeOnlyAppData(SAFE_ADDRESS, CLAIM_CONTRACT_ADDRESS);
  const staticOrderData = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "address", "bytes32"],
    [CLAIM_TOKEN_ADDRESS, BUY_TOKEN_ADDRESS, SAFE_ADDRESS, appData.hash]
  );

  const params = [
    // handlerAddress
    CLAIM_AND_SWAP_CONTRACT,
    // Order Salt
    // keccak("karvest");
    // TODO - This needs to be changed for every new order placement.
    "0x5cac3505cb5ef10c425e9385b61b0bc2f433203871d18aca2409326bd98b0529",
    staticOrderData,
  ];

  console.log("params", params);
}

buildCreateOrderData();
