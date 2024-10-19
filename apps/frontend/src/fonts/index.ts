import { Nunito, Open_Sans } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const Fonts = {
  nunito,
  openSans,
};

export default Fonts;
