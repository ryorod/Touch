import myTokenABI from "@/abis/MyToken.json";
import secretTokenManagerABI from "@/abis/SecretTokenManager.json";
import encountersFactoryABI from "@/abis/EncountersFactory.json";
import {
  ENCOUNTERS_FACTORY_ADDRESS,
  MYTOKEN_CONTRACT_ADDRESS,
  SECRET_TOKEN_MANAGER_ADDRESS,
} from "./config";

export const MyTokenABIAddress = {
  abi: myTokenABI,
  address: MYTOKEN_CONTRACT_ADDRESS,
};

export const SecretTokenManagerABIAddress = {
  abi: secretTokenManagerABI,
  address: SECRET_TOKEN_MANAGER_ADDRESS,
};

export const EncountersFactoryABIAddress = {
  abi: encountersFactoryABI,
  address: ENCOUNTERS_FACTORY_ADDRESS,
};
