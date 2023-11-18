import { BigNumber, ethers } from "ethers";

/// WXDAI
const CLAIM_TOKEN_ADDRESS = "0x608Acd7d1c01439b351FEfAFf7636A136aF3Da81";
/// COW on Gnosis Chain
const BUY_TOKEN_ADDRESS = "0x177127622c4A00F3d409B75571e12cB3c8973d3c";

/// OUR MOCK Deposit Contract
const CLAIM_CONTRACT_ADDRESS = "0xf07afcee9dd0b859edd41603a3d725b70086fef6";

const SAFE_ADDRESS = "0x608Acd7d1c01439b351FEfAFf7636A136aF3Da81";

const provider = new ethers.providers.JsonRpcProvider(
  process.env.NODE_URL || "https://rpc.gnosischain.com/"
);
const COW_API = "https://barn.api.cow.fi/xdai/api/v1";


// type Data = {
//   claimToken: string; // Also Sell Token
//   buyToken: string;
//   eth1WithdrawAddress: string;
//   appData: string;
// };

function buildCreateOrderData() {
  // TODO - generate and post app data use hash below.

  // const data = {
  //   claimToken: CLAIM_TOKEN_ADDRESS,
  //   buyToken: BUY_TOKEN_ADDRESS,
  //   eth1WithdrawAddress: SAFE_ADDRESS,
  //   /// TODO - THIS IS INCORRECT and needs to be regenerated.
  //   appData:
  //     "0x9c71e3dd70ffd5d41ac73be01db1bf7409c9879359e59365d2a3529db7c09a2a",
  // };
  const thirdParameter = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "address", "bytes32"],
    [
      CLAIM_TOKEN_ADDRESS,
      BUY_TOKEN_ADDRESS,
      SAFE_ADDRESS,
      "0x9c71e3dd70ffd5d41ac73be01db1bf7409c9879359e59365d2a3529db7c09a2a",
    ]
  );

  const params = [
    "0x6c14F0ef1d77fD9a2F43d6CF17ac6F255803aeD0", // Claim & Swap Contract
    "0x5cac3505cb5ef10c425e9385b61b0bc2f433203871d18aca2409326bd98b0529",
    thirdParameter
  ];

  console.log("params", params);
}


buildCreateOrderData()