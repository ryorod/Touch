import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

const NavList = [
  {
    text: "Register",
    href: "/register",
  },
  {
    text: "Account",
    href: "/account",
  },
];

export default function HomePage() {
  return (
    <div className="pt-16 pb-8">
      <div className="w-11/12 max-w-screen-xl mx-auto">
        <h1 className="w-64 mx-auto translate-x-[-2.5%]">
          <img src="/logo.png" alt="Touch" />
        </h1>

        <div className="flex justify-center mt-16">
          <NavigationMenu>
            <NavigationMenuList>
              {NavList.map((item, i) => {
                return (
                  <NavigationMenuItem key={i} className="border rounded-md">
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {item.text}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </div>
  );
}
