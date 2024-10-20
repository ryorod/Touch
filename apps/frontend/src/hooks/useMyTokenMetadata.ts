import { MyTokenABIAddress } from "@/constants/abiAndAddress";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import axios from "axios";
import { convertIpfsUrlToGatewayUrl } from "@/utils/ipfs";

export const useMyTokenMetadata = (tokenId: string, onlyTokenURI?: boolean) => {
  const { data: tokenURI } = useReadContract({
    ...MyTokenABIAddress,
    functionName: "tokenURI",
    args: [Number(tokenId)],
    query: {
      enabled: !isNaN(Number(tokenId)),
    },
  });

  const [metadata, setMetadata] = useState<NFTMetadata | null>();

  useEffect(() => {
    if (typeof tokenURI === "string" && !onlyTokenURI) {
      axios
        .get<NFTMetadata>(convertIpfsUrlToGatewayUrl(tokenURI))
        .then((res) => setMetadata(res.data))
        .catch((e) => {
          console.error("Error fetching metadata:", e);
          setMetadata(null);
        });
    }
  }, [tokenURI, onlyTokenURI]);

  return { tokenURI, metadata };
};
