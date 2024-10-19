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
    <div className="py-16">
      <div className="w-11/12 max-w-screen-xl mx-auto">
        <h1 className="text-center text-6xl font-bold italic text-sky-400">
          Touch
        </h1>

        <div className="flex justify-center mt-12">
          <NavigationMenu>
            <NavigationMenuList>
              {NavList.map((item, i) => {
                return (
                  <NavigationMenuItem key={i}>
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
