import { PINATA_GATEWAY, PINATA_JWT } from "@/constants/config";
import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
  pinataGateway: PINATA_GATEWAY,
});

export const uploadFileToIpfs = async (file: File) => {
  const added = await pinata.upload.file(file);
  return added.cid;
};

export const uploadJsonToIpfs = async (json: object) => {
  const added = await pinata.upload.json(json);
  return added.cid;
};

export const uploadMetadataToIPFS = async (
  name: string,
  description: string,
  imageFile: File
) => {
  try {
    const imageCID = await uploadFileToIpfs(imageFile);
    const imageUrl = `ipfs://${imageCID}`;

    const metadata: NFTMetadata = {
      name,
      description,
      image: imageUrl,
    };

    const metadataCID = await uploadJsonToIpfs(metadata);
    const metadataUrl = `ipfs://${metadataCID}`;

    return metadataUrl;
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    return null;
  }
};
