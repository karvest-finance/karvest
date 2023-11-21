import { ethers } from "ethers";
import { HookBuilder } from "./appData";
import {
  SETTLEMENT_CONTRACT_ADDRESS,
  COW_API,
  WEB3_PROVIDER,
  GNO_TOKEN_ADDRESS,
  BUY_TOKEN_ADDRESS,
  GNO_CLAIM_CONTRACT_ADDRESS,
} from "./constants";

async function eoaClaimAndSwap(
  wallet: ethers.Wallet,
  provider: ethers.providers.JsonRpcProvider,
  sellToken: string,
  buyToken: string,
  claimAddress: string
) {
  const { chainId } = await provider.getNetwork();
  let builder = new HookBuilder(provider, COW_API);
  console.log(`connected to chain ${chainId} with account ${wallet.address}`);
  console.log("Building claim and permit hook");
  let preHooks = await Promise.all([
    builder.permissionlessClaimHook(wallet.address, claimAddress),
    builder.permitHook({
      wallet,
      tokenAddress: sellToken,
      amount: ethers.constants.MaxUint256,
      spender: SETTLEMENT_CONTRACT_ADDRESS,
    }),
  ]);

  const appData = builder.generateAppData(preHooks, []);
  let contract = new ethers.Contract(
    claimAddress,
    [`function withdrawableAmount(address)`],
    provider
  );
  const claimAmount = await contract
    .connect(wallet)
    .withdrawableAmount(wallet.address);
  if (!(claimAmount > 0)) {
    console.log("Nothing to claim");
    return;
  }
  console.log("Claim Amount:", claimAmount);
  const orderConfig = {
    sellToken,
    buyToken,
    receiver: ethers.constants.AddressZero,
    sellAmount: claimAmount,
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

const wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY || "0xBADPRIVATEKEY",
  WEB3_PROVIDER
);

eoaClaimAndSwap(
  wallet,
  WEB3_PROVIDER,
  GNO_TOKEN_ADDRESS,
  BUY_TOKEN_ADDRESS,
  GNO_CLAIM_CONTRACT_ADDRESS
);
