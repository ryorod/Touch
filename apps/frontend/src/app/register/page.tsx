import RegisterPage from "@/components/pages/Register";
import { metadata as defaultMetadata } from "@/app/layout";
import { Metadata } from "next";

const title = "Register";
const description = `Register your "Touch".`;

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

export default RegisterPage;
