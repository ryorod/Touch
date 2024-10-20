import { useMyTokenMetadata } from "@/hooks/useMyTokenMetadata";
import { convertIpfsUrlToGatewayUrl } from "@/utils/ipfs";

interface MyTokenProps {
  tokenId: string;
}

export default function MyToken({ tokenId }: MyTokenProps) {
  const { metadata } = useMyTokenMetadata(tokenId);

  if (!metadata) return null;

  return (
    <div>
      <div className="max-w-48 mx-auto">
        <img src={convertIpfsUrlToGatewayUrl(metadata.image)} alt="" />
      </div>
      <p className="text-xl font-bold mt-2">{metadata.name}</p>
      <p className="text-start mt-1 max-w-72 mx-auto">{metadata.description}</p>
    </div>
  );
}
