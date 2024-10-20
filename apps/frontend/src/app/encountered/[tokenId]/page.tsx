import { metadata as defaultMetadata } from "@/app/layout";
import EncounteredPage from "@/components/pages/Encountered";
import { Metadata } from "next";

// TODO: reflect tokenId
const title = "Encountered";
const description = `Get your proof of encounter by "Touch".`;

export const metadata: Metadata = {
  ...defaultMetadata,
  title,
  description,
  openGraph: {
    ...defaultMetadata.openGraph,
    title,
    description,
  },
};

export default EncounteredPage;
