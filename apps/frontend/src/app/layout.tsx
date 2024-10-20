import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Fonts from "@/fonts";
import { SITE_URL } from "@/constants/config";
import Footer from "./footer";

const title = "Touch";
const titleDefault = "Touch - cherish your encounters.";
const titleTemplate = "%s :: Touch";
const description = `Give NFTs to anyone you meet, by tapping your NFC card on their smartphone.`;
const url = SITE_URL;

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
    images: [
      {
        url: SITE_URL + "/ogp.png",
      },
    ],
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
      <body
        className={`${Fonts.nunito.className} antialiased relative min-h-screen`}
      >
        <div className="fixed inset-0 bg-gradient-to-b from-white to-sky-50 z-0 pointer-events-none"></div>
        <div className="relative">
          <Providers>
            <main>{children}</main>
            <Footer />
          </Providers>
        </div>
      </body>
    </html>
  );
}
