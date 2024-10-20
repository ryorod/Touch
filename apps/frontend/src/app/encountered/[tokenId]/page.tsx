import { metadata as defaultMetadata } from "@/app/layout";
import EncounteredPage from "@/components/pages/Encountered";
import { Metadata } from "next";

// TODO: reflect tokenId
const title = "Encountered";

export const metadata: Metadata = {
  ...defaultMetadata,
  title,
  openGraph: {
    ...defaultMetadata.openGraph,
    title,
  },
};

export default EncounteredPage;
