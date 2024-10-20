"use client";
import MyToken from "@/components/MyToken";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useMyTokenId } from "@/hooks/useMyTokenID";
import { useReadBalance } from "@/hooks/useReadBalance";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const { authenticated, user, login } = usePrivy();
  const [hasMyToken, setHasMyToken] = useState<boolean>();

  const { data: balanceData } = useReadBalance();
  const { data: tokenOfOwnerData } = useMyTokenId(balanceData);

  useEffect(() => {
    if (authenticated && balanceData !== undefined) {
      if ((balanceData as bigint) > BigInt(0)) {
        setHasMyToken(true);
      } else {
        setHasMyToken(false);
      }
    }
  }, [authenticated, balanceData]);

  return (
    <div className="py-16">
      <div className="w-11/12 max-w-xl mx-auto">
        <h1 className="text-5xl font-bold text-sky-400 mb-12">Account</h1>
        <Card className="p-4">
          {!authenticated ? (
            <div className="text-center">
              <Button onClick={login}>Login</Button>
            </div>
          ) : (
            <div>
              <div className="text-center">
                {hasMyToken ? (
                  typeof tokenOfOwnerData === "bigint" ? (
                    <div>
                      <h2 className="font-bold mb-2">Your MyToken</h2>
                      <MyToken tokenId={tokenOfOwnerData.toString()} />
                    </div>
                  ) : (
                    <Loading />
                  )
                ) : hasMyToken === false ? (
                  <div>
                    <Link
                      href="/register"
                      className="font-bold my-8 inline-block underline"
                    >
                      Create and register your MyToken!
                    </Link>
                  </div>
                ) : (
                  <Loading />
                )}
              </div>
              {user?.wallet && (
                <p className="mt-4 text-xs break-all text-gray-500">
                  {user.wallet.address}
                </p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-48">
      <Spinner />
    </div>
  );
};
