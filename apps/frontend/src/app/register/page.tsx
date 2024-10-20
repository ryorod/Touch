import RegisterPage from "@/components/pages/Register";
import { metadata as defaultMetadata } from "@/app/layout";
import { Metadata } from "next";

const title = "Register";

export const metadata: Metadata = {
  ...defaultMetadata,
  title,
  openGraph: {
    ...defaultMetadata.openGraph,
    title,
  },
};

export default RegisterPage;
