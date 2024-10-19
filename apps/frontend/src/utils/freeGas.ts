import { createPublicClient, createWalletClient, http } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { skaleCalypsoTestnet } from "viem/chains";
import SkalePowMiner from "@skaleproject/pow";

export const getFreeGas = async (recipient: string) => {
  const miner = new SkalePowMiner();

  const provider = createPublicClient({
    chain: skaleCalypsoTestnet,
    transport: http(),
  });
  const privateKey: `0x${string}` = generatePrivateKey();

  const account = privateKeyToAccount(privateKey);

  const randomWallet = createWalletClient({
    account,
    chain: skaleCalypsoTestnet,
    transport: http(),
  });

  const nonce = await provider.getTransactionCount({
    address: randomWallet.account.address,
  });

  const functionSignature = "0x0c11dedd";

  const mineFreeGasResult = await miner.mineGasForTransaction(
    nonce,
    100_000,
    randomWallet.account.address
  );

  const request = {
    from: randomWallet.account.address,
    to: "0x62Fe932FF26e0087Ae383f6080bd2Ed481bA5A8A" as `0x${string}`,
    data: `${functionSignature}000000000000000000000000${recipient.substring(
      2
    )}` as `0x${string}`,
    nonce,
    gasPrice: BigInt(mineFreeGasResult),
  };

  const response = await randomWallet.sendTransaction(request);
  return await provider.waitForTransactionReceipt({ hash: response });
};
