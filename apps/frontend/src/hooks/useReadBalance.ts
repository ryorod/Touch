import { MyTokenABIAddress } from "@/constants/abiAndAddress";
import { usePrivy } from "@privy-io/react-auth";
import { useReadContract } from "wagmi";

export const useReadBalance = () => {
  const { authenticated, user } = usePrivy();

  return useReadContract({
    ...MyTokenABIAddress,
    functionName: "balanceOf",
    args: [user?.wallet?.address],
    query: {
      enabled: authenticated && !!user?.wallet?.address,
    },
  });
};
