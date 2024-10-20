import { metadata as defaultMetadata } from "@/app/layout";
import { Metadata } from "next";
import AccountPage from "@/components/pages/Account";

const title = "My Account";

export const metadata: Metadata = {
  ...defaultMetadata,
  title,
  openGraph: {
    ...defaultMetadata.openGraph,
    title,
  },
};

export default AccountPage;
