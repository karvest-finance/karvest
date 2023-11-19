import { ethers } from "ethers";
import { mixedEoaSafeAppData } from "./appData";

/// GNO
const CLAIM_TOKEN_ADDRESS = "0x9c58bacc331c9aa871afd802db6379a98e80cedb";
/// COW on Gnosis Chain
const BUY_TOKEN_ADDRESS = "0x177127622c4A00F3d409B75571e12cB3c8973d3c";

/// OUR MOCK Deposit Contract
const CLAIM_CONTRACT_ADDRESS = "0x9c58bacc331c9aa871afd802db6379a98e80cedb";

const SAFE_ADDRESS = "0x608Acd7d1c01439b351FEfAFf7636A136aF3Da81";

const CLAIM_AND_SWAP_CONTRACT = "0x35f29f3cb53bddb11b6e286a0454a9224dd3adaa";

///
async function buildCreateOrderData() {
  const eoaAddress = process.env.ETH1_WITHDRAW_ADDRESS;
  if (eoaAddress === undefined)
    throw Error("Invalid env var ETH1_WITHDRAW_ADDRESS");
  const appData = await mixedEoaSafeAppData(
    eoaAddress,
    SAFE_ADDRESS,
    CLAIM_CONTRACT_ADDRESS,
    CLAIM_TOKEN_ADDRESS
  );
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
    // ethers.utils.id()
    "0x5cac3505cb5ef10c425e9385b61b0bc2f433203871d18aca2409326bd98b0529",
    // ethers.utils.id(Date.now().toString()),
    staticOrderData,
  ];

  console.log("params", params);
}

buildCreateOrderData();
