import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Fonts from "@/fonts";

const title = "Touch";
const titleDefault = "Touch - cherish your encounters.";
const titleTemplate = "%s :: Touch";
const description = `"Touch" and cherish your encounters.`;
const url = "https://touch.ryorod.dev";

export const metadata: Metadata = {
  title: {
    default: titleDefault,
    template: titleTemplate,
  },
  description,
  openGraph: {
    title: {
      default: titleDefault,
      template: titleTemplate,
    },
    description,
    type: "website",
    locale: "en_US",
    url,
    siteName: title,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${Fonts.nunito.className} antialiased bg-sky-50`}>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
