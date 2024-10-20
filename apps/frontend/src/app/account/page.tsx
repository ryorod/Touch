import { metadata as defaultMetadata } from "@/app/layout";
import { Metadata } from "next";
import AccountPage from "@/components/pages/Account";

const title = "My Account";
const description = `Your account page for "Touch".`;

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

export default AccountPage;
