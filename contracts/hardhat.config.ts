import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import { HttpNetworkAccountsUserConfig } from "hardhat/types";

dotenv.config();

const { MNEMONIC, INFURA_KEY, ETHERSCAN_API_KEY, GNOSISSCAN_API_KEY} = process.env;

const sharedAccountConfig: HttpNetworkAccountsUserConfig = {
  mnemonic: MNEMONIC || ""
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      accounts: sharedAccountConfig,
      allowUnlimitedContractSize: true,
      blockGasLimit: 100000000,
      gas: 100000000,
    },
    goerli: {
      accounts: sharedAccountConfig,
      url: `https://goerli.infura.io/v3/${INFURA_KEY}`,
    },
    gnosis: {
      accounts: sharedAccountConfig,
      url: "https://rpc.gnosis.gateway.fm",
    },
  },
  sourcify: {
    enabled: false,
  },
  etherscan: {
    apiKey: GNOSISSCAN_API_KEY,
    // apiKey: ETHERSCAN_API_KEY,
    customChains: [
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io/",
        },
      },
    ]
  },
};

export default config;
