import { MyTokenABIAddress } from "@/constants/abiAndAddress";
import { usePrivy } from "@privy-io/react-auth";
import { useReadContract } from "wagmi";

export const useMyTokenId = (balanceData: unknown) => {
  const { authenticated, user } = usePrivy();

  return useReadContract({
    ...MyTokenABIAddress,
    functionName: "tokenOfOwnerByIndex",
    args: [user?.wallet?.address, 0],
    query: {
      enabled:
        authenticated &&
        !!user?.wallet?.address &&
        !!balanceData &&
        (balanceData as bigint) > BigInt(0),
    },
  });
};
