"use client";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const { authenticated, ready, logout } = usePrivy();
  const pathname = usePathname();

  return (
    <footer className="pb-4">
      <div className="w-11/12 max-w-xl mx-auto">
        {pathname !== "/" && (
          <div className="text-center">
            <Link href="/" className="text-sm underline">
              HOME
            </Link>
          </div>
        )}
        {authenticated && ready && (
          <div className="text-end">
            <button onClick={logout} className="text-sm">
              Logout
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}
