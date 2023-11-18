import { ethers } from "ethers";
import { safeOnlyAppData } from "./appData";

/// WXDAI
const CLAIM_TOKEN_ADDRESS = "0x608Acd7d1c01439b351FEfAFf7636A136aF3Da81";
/// COW on Gnosis Chain
const BUY_TOKEN_ADDRESS = "0x177127622c4A00F3d409B75571e12cB3c8973d3c";

/// OUR MOCK Deposit Contract
const CLAIM_CONTRACT_ADDRESS = "0xf07afcee9dd0b859edd41603a3d725b70086fef6";

const SAFE_ADDRESS = "0x608Acd7d1c01439b351FEfAFf7636A136aF3Da81";
const _OLD_CLAIM_AND_SWAP_CONTRACT =
  "0x6c14F0ef1d77fD9a2F43d6CF17ac6F255803aeD0";
const CLAIM_AND_SWAP_CONTRACT = "0x38F97f876BFAEF746E6A9D5329E6ACE14C0bB9f5";

async function buildCreateOrderData() {
  // TODO - generate and post app data use hash below.
  const appData = await safeOnlyAppData(SAFE_ADDRESS, CLAIM_CONTRACT_ADDRESS);
  const thirdParameter = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "address", "bytes32"],
    [CLAIM_TOKEN_ADDRESS, BUY_TOKEN_ADDRESS, SAFE_ADDRESS, appData.hash]
  );

  const params = [
    CLAIM_AND_SWAP_CONTRACT,
    // keccak("karvest");
    "0x5cac3505cb5ef10c425e9385b61b0bc2f433203871d18aca2409326bd98b0529",
    thirdParameter,
  ];

  console.log("params", params);
}

buildCreateOrderData();
