// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SecretTokenManagerModule = buildModule(
  "SecretTokenManagerModule",
  (m) => {
    const secretTokenManager = m.contract("SecretTokenManager");

    return { secretTokenManager };
  }
);

export default SecretTokenManagerModule;
