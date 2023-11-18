import { ethers } from "ethers";
import { generateAppData, buildClaimHook, buildPermitHook } from "./appData";

async function eoaClaimAndSwap(
  wallet: ethers.Wallet,
  provider: ethers.providers.JsonRpcProvider,
  sellToken: string,
  buyToken: string,
  claimAddress: string
) {
  const { chainId } = await provider.getNetwork();
  console.log(`connected to chain ${chainId} with account ${wallet.address}`);
  const appData = generateAppData(
    [
      buildClaimHook(provider, wallet.address, claimAddress),
      await buildPermitHook(
        wallet,
        provider,
        SETTLEMENT_CONTRACT_ADDRESS,
        ethers.constants.MaxUint256,
        sellToken,
        chainId
      ),
    ],
    []
  );
  const orderConfig = {
    sellToken,
    buyToken,
    receiver: ethers.constants.AddressZero,
    sellAmount: `${ethers.utils.parseUnits("0.1", 18)}`,
    kind: "sell",
    partiallyFillable: false,
    sellTokenBalance: "erc20",
    buyTokenBalance: "erc20",
    appData: appData.data,
  };
  const quotePostBody = JSON.stringify({
    from: wallet.address,
    sellAmountBeforeFee: orderConfig.sellAmount,
    ...orderConfig,
  });

  console.log("Getting Quote...");
  const { id: quoteId, quote } = await fetch(`${COW_API}/quote`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: quotePostBody,
  }).then((response) => {
    return response.json();
  });
  console.log("quote:", quoteId, quote);

  const orderData = {
    ...orderConfig,
    sellAmount: quote.sellAmount,
    buyAmount: `${ethers.BigNumber.from(quote.buyAmount).mul(99).div(100)}`,
    validTo: quote.validTo,
    appData: appData.hash,
    feeAmount: quote.feeAmount,
  };
  const orderSignature = await wallet._signTypedData(
    {
      name: "Gnosis Protocol",
      version: "v2",
      chainId,
      verifyingContract: SETTLEMENT_CONTRACT_ADDRESS,
    },
    {
      Order: [
        { name: "sellToken", type: "address" },
        { name: "buyToken", type: "address" },
        { name: "receiver", type: "address" },
        { name: "sellAmount", type: "uint256" },
        { name: "buyAmount", type: "uint256" },
        { name: "validTo", type: "uint32" },
        { name: "appData", type: "bytes32" },
        { name: "feeAmount", type: "uint256" },
        { name: "kind", type: "string" },
        { name: "partiallyFillable", type: "bool" },
        { name: "sellTokenBalance", type: "string" },
        { name: "buyTokenBalance", type: "string" },
      ],
    },
    orderData
  );
  const postBody = JSON.stringify({
    ...orderData,
    from: wallet.address,
    appData: orderConfig.appData,
    appDataHash: orderData.appData,
    signingScheme: "eip712",
    signature: orderSignature,
    quoteId,
  });
  console.log(`Posting order...`);
    const orderUid = await fetch(`${COW_API}/orders`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: postBody,
    }).then((response) => response.json());
    console.log("order:", orderUid);
}

/// GNO Token
const CLAIM_TOKEN_ADDRESS = "0x9c58bacc331c9aa871afd802db6379a98e80cedb";
/// COW on Gnosis Chain
const BUY_TOKEN_ADDRESS = "0x177127622c4A00F3d409B75571e12cB3c8973d3c";
/// SBD Deposit Contract
const CLAIM_CONTRACT_ADDRESS = "0x0B98057eA310F4d31F2a452B414647007d1645d9";

const SETTLEMENT_CONTRACT_ADDRESS =
  "0x9008D19f58AAbD9eD0D60971565AA8510560ab41";

const provider = new ethers.providers.JsonRpcProvider(
  process.env.NODE_URL || "https://rpc.gnosischain.com/"
);
const COW_API = "https://barn.api.cow.fi/xdai/api/v1";

const wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY || "0xBADPRIVATEKEY",
  provider
);

eoaClaimAndSwap(
  wallet,
  provider,
  CLAIM_TOKEN_ADDRESS,
  BUY_TOKEN_ADDRESS,
  CLAIM_CONTRACT_ADDRESS
);
