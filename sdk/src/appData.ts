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

export class HookBuilder {
  readonly provider: ethers.providers.JsonRpcProvider;
  readonly cowApi: string;

  /**
   *
   * @param web3 - rpc connection to web3 environment.
   * @param cowApiUrl - CoWSwap API endpoint.
   */
  constructor(web3: ethers.providers.JsonRpcProvider, cowApiUrl: string) {
    this.provider = web3;
    this.cowApi = cowApiUrl;
  }

  /// Builds ERC20 Permit hool for an externally owned account.
  async permitHook(params: PermitHookParams) {
    const { wallet, tokenAddress, spender, amount } = params;
    const token = new ethers.Contract(
      tokenAddress,
      [
        `function decimals() view returns (uint8)`,
        `function name() view returns (string)`,
        `function version() view returns (string)`,
        `function nonces(address owner) view returns (uint256)`,
        `
          function permit(
            address owner,
            address spender,
            uint256 value,
            uint256 deadline,
            uint8 v,
            bytes32 r,
            bytes32 s
          )
        `,
      ],
      this.provider
    );
    const [name, version, network, nonce] = await Promise.all([
      token.name(),
      token.version(),
      this.provider.getNetwork(),
      token.nonces(wallet.address),
    ]);
    const permit = {
      owner: wallet.address,
      spender,
      value: amount,
      nonce,
      deadline: ethers.constants.MaxUint256,
    };
    const permitSignature = ethers.utils.splitSignature(
      await wallet._signTypedData(
        {
          // TODO - parallel requests!
          name,
          version,
          chainId: network.chainId,
          verifyingContract: token.address,
        },
        {
          Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        permit
      )
    );
    const permitParams = [
      permit.owner,
      permit.spender,
      permit.value,
      permit.deadline,
      permitSignature.v,
      permitSignature.r,
      permitSignature.s,
    ];
    const permitHook = {
      target: token.address,
      callData: token.interface.encodeFunctionData("permit", permitParams),
      gasLimit: `${await token.estimateGas.permit(...permitParams)}`,
    };
    return permitHook;
  }

  /** Builds a claimHook for any permissionless claim function
   * with signature `function ${claimFunctionName}(address)`
   * @param claimantAddress address to be passed to claim Function (i.e. claim for)
   * @param claimContractAddress contract where claim should be called.
   * @param claimFunctionName [optional] name of claim function (defaults to `claimWithdrawal`)
   * @returns CoWHook for claim
   */
  async permissionlessClaimHook(
    claimantAddress: string,
    claimContractAddress: string,
    claimFunctionName?: string
  ): Promise<CowHook> {
    let claimName = claimFunctionName ? claimFunctionName : "claimWithdrawal";
    let contract = new ethers.Contract(
      claimContractAddress,
      [`function ${claimName}(address)`],
      // provider required to estimate gas.
      this.provider
    );
    const callData = contract.interface.encodeFunctionData(claimName, [
      claimantAddress,
    ]);
    return {
      target: contract.address,
      callData,
      gasLimit: `${await contract.estimateGas.claimWithdrawal(
        claimantAddress
      )}`,
    };
  }

  /** Generates call data and gas limit of a call to `transferBalanceFrom` call.
   * @param tokenAddress address of token to be transfered
   * @param from address of account whose balance is being transfered
   * @param to address of account who to receive the full balance of `tokenAddress` from `from`
   * @returns CoWHook representing this interaction.
   */
  async transferBalanceFromHook(
    tokenAddress: string,
    from: string,
    to: string
  ): Promise<CowHook> {
    // TODO - configure by network (or deploy to same address)
    const TRANSFER_BALANCE_FROM_CONTRACT =
      "0xD4121d2d90CE7C5F7FB66c4E96815fc377481635";
    const transfer = new ethers.Contract(
      TRANSFER_BALANCE_FROM_CONTRACT,
      [`function transferBalanceFrom(address token, address from, address to)`],
      this.provider
    );
    const params = [tokenAddress, from, to];
    const callData = transfer.interface.encodeFunctionData(
      "transferBalanceFrom",
      params
    );
    console.log("encoded data for transferBalanceFromHook");
    return {
      target: transfer.address,
      callData,
      gasLimit: `${await transfer.estimateGas.transferBalanceFrom(...params)}`,
    };
  }

  /**
   * Constructs valid (stringified) AppData JSON with the given hooks
   * @param preHooks pre-settlement Interactions
   * @param postHooks post-settlement Interactions
   * @returns AppData structure (with content and hash)
   */
  generateAppData(preHooks: CowHook[], postHooks: CowHook[]): AppData {
    const appData = JSON.stringify({
      // TODO - use app_data SDK for other fields (this is only for hooks)
      appCode: "Karvest Finance",
      version: "0.9.0",
      metadata: {
        hooks: {
          pre: preHooks,
          post: postHooks,
        },
      },
    });

    const appHash = ethers.utils.id(appData);
    console.log(`Constructed AppData with Hash ${appHash}`);
    // https://api.cow.fi/docs/#/
    return { hash: appHash, data: appData };
  }

  async postAppData({ hash, data }: AppData): Promise<void> {
    const url = `${this.cowApi}/app_data/${hash}`;
    const requestBody = { fullAppData: data };

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log(`App data with hash ${hash} posted successfully`);
      } else {
        throw new Error(
          `Error updating app data: ${response.status} - ${response.statusText}`
        );
      }
    } catch (error) {
      console.error(`Error posting app data ${error}`);
    }
  }
}

// function PermittableToken(
//   provider: ethers.providers.JsonRpcProvider,
//   address: string
// ): ethers.Contract {
//   return new ethers.Contract(
//     address,
//     [
//       `function decimals() view returns (uint8)`,
//       `function name() view returns (string)`,
//       `function version() view returns (string)`,
//       `function nonces(address owner) view returns (uint256)`,
//       `
//         function permit(
//           address owner,
//           address spender,
//           uint256 value,
//           uint256 deadline,
//           uint8 v,
//           bytes32 r,
//           bytes32 s
//         )
//       `,
//     ],
//     provider
//   );
// }

// /// Permit Token Hook!
// export async function buildPermitHook(
//   wallet: ethers.Wallet,
//   provider: ethers.providers.JsonRpcProvider,
//   spender: string,
//   amount: BigNumber,
//   permittableTokenAddress: string,
//   chainId: number
// ): Promise<CowHook> {
//   const token = PermittableToken(provider, permittableTokenAddress);
//   const permit = {
//     owner: wallet.address,
//     spender,
//     value: amount,
//     nonce: await token.nonces(wallet.address),
//     deadline: ethers.constants.MaxUint256,
//   };
//   const permitSignature = ethers.utils.splitSignature(
//     await wallet._signTypedData(
//       {
//         name: await token.name(),
//         version: await token.version(),
//         chainId,
//         verifyingContract: token.address,
//       },
//       {
//         Permit: [
//           { name: "owner", type: "address" },
//           { name: "spender", type: "address" },
//           { name: "value", type: "uint256" },
//           { name: "nonce", type: "uint256" },
//           { name: "deadline", type: "uint256" },
//         ],
//       },
//       permit
//     )
//   );
//   const permitParams = [
//     permit.owner,
//     permit.spender,
//     permit.value,
//     permit.deadline,
//     permitSignature.v,
//     permitSignature.r,
//     permitSignature.s,
//   ];
//   const permitHook = {
//     target: token.address,
//     callData: token.interface.encodeFunctionData("permit", permitParams),
//     gasLimit: `${await token.estimateGas.permit(...permitParams)}`,
//   };
//   console.log("permit hook:", permitHook);
//   return permitHook;
// }

// /// Hook to Claim Validator Rewards for withdrawalAddress
// export function buildClaimHook(
//   provider: ethers.providers.JsonRpcProvider,
//   withdrawalAddress: string,
//   claimContract: string
// ): CowHook {
//   const CLAIM_CONTRACT = new ethers.Contract(
//     claimContract,
//     [
//       `function withdrawableAmount(address user) view returns (u256)`,
//       `function claimWithdrawal(address _address) public`,
//     ],
//     provider
//   );

//   const claimHook = {
//     target: CLAIM_CONTRACT.address,
//     callData: CLAIM_CONTRACT.interface.encodeFunctionData("claimWithdrawal", [
//       withdrawalAddress,
//     ]),
//     // Example Tx: https://gnosisscan.io/tx/0x9501e8cbe873126bfb52ceab26a8644f1f8607f0de2937fa29d2112569480c59
//     // Gas Limit: 82264
//     // gasLimit: `${await DEPOSIT_CONTRACT.estimateGas.claimWithdrawal(...withdrawalAddress)}`,
//     // Now it doesn't need to be async!
//     gasLimit: "82264",
//   };
//   return claimHook;
// }

// export function generateAppData(
//   preHooks: object[],
//   postHooks: object[]
// ): AppData {
//   const appData = JSON.stringify({
//     appCode: "CoW Swap",
//     version: "0.9.0",
//     metadata: {
//       hooks: {
//         pre: preHooks,
//         post: postHooks,
//       },
//     },
//   });

//   const appHash = ethers.utils.id(appData);
//   console.log(`Constructed AppData with Hash ${appHash}`);

//   console.log("App Data Content:", appData);
//   // https://api.cow.fi/docs/#/
//   return { hash: appHash, data: appData };
// }

// export async function postAppData(appData: AppData): Promise<void> {
//   // TODO - EOA permit SAFE via set allowance and encode transfer from hook.
//   let { hash, data } = appData;

//   const url = `https://api.cow.fi/xdai/api/v1/app_data/${hash}`;
//   const requestBody = {
//     fullAppData: data,
//   };

//   try {
//     await axios.put(url, requestBody, {
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     });

//     console.log("App data posted successfully");
//   } catch (error: any) {
//     console.error("Error updating app data:", error.message);
//   }
// }

// export async function buildTransferBalanceFromHook(
//   provider: ethers.providers.JsonRpcProvider,
//   tokenAddress: string,
//   from: string,
//   to: string
// ): Promise<CowHook> {
//   const TRANSFER_BALANCE_FROM_CONTRACT =
//     "0xD4121d2d90CE7C5F7FB66c4E96815fc377481635";
//   const transfer = new ethers.Contract(
//     TRANSFER_BALANCE_FROM_CONTRACT,
//     [
//       `function transferBalanceFrom(address token, address from, address to) public`,
//     ],
//     provider
//   );
//   const params = [tokenAddress, from, to];
//   return {
//     target: transfer.address,
//     callData: transfer.interface.encodeFunctionData(
//       "transferBalanceFrom",
//       params
//     ),
//     gasLimit: `${await transfer.estimateGas.transferBalanceFrom(...params)}`,
//   };
// }
