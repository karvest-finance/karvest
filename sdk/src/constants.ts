import { ethers } from "ethers";

/// GNO Token
const GNO_TOKEN_ADDRESS = "0x9c58bacc331c9aa871afd802db6379a98e80cedb";
/// COW on Gnosis Chain
const BUY_TOKEN_ADDRESS = "0x177127622c4A00F3d409B75571e12cB3c8973d3c";
/// SBD Deposit Contract
const GNO_CLAIM_CONTRACT_ADDRESS = "0x0B98057eA310F4d31F2a452B414647007d1645d9";
/// Programatic Order Contract
const CLAIM_AND_SWAP_CONTRACT = "0x35f29f3cb53bddb11b6e286a0454a9224dd3adaa";

const SETTLEMENT_CONTRACT_ADDRESS =
  "0x9008D19f58AAbD9eD0D60971565AA8510560ab41";

const WEB3_PROVIDER = new ethers.providers.JsonRpcProvider(
  process.env.NODE_URL || "https://rpc.gnosischain.com/"
);
const COW_API = process.env.COW_API || "https://api.cow.fi/xdai/api/v1";

export {
  CLAIM_AND_SWAP_CONTRACT,
  GNO_TOKEN_ADDRESS,
  BUY_TOKEN_ADDRESS,
  GNO_CLAIM_CONTRACT_ADDRESS,
  SETTLEMENT_CONTRACT_ADDRESS,
  WEB3_PROVIDER,
  COW_API,
};
