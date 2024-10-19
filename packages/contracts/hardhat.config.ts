import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    skaleCalypsoTestnet: {
      url: process.env.SKALE_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: {
      skaleCalypsoTestnet: process.env.ETHERSCAN_API_KEY!,
    },
    customChains: [
      {
        network: "skaleCalypsoTestnet",
        chainId: parseInt(process.env.CHAIN_ID!),
        urls: {
          apiURL: process.env.API_URL!,
          browserURL: process.env.BLOCKEXPLORER_URL!,
        },
      },
    ],
  },
};

export default config;
