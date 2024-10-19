// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import {
  MY_TOKEN_ADDRESS,
  TOKEN_MANAGER_ADDRESS,
} from "../arguments/EncountersFactory";

const EncountersFactoryModule = buildModule("EncountersFactoryModule", (m) => {
  const tokenManagerAddress = m.getParameter(
    "tokenManagerAddress",
    TOKEN_MANAGER_ADDRESS
  );
  const myTokenAddress = m.getParameter("myTokenAddress", MY_TOKEN_ADDRESS);

  const encountersFactory = m.contract("EncountersFactory", [
    tokenManagerAddress,
    myTokenAddress,
  ]);

  return { encountersFactory };
});

export default EncountersFactoryModule;
