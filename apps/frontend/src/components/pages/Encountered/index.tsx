"use client";
import MyToken from "@/components/MyToken";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  EncountersCollectionABIAddress,
  EncountersFactoryABIAddress,
} from "@/constants/abiAndAddress";
import { useMyTokenId } from "@/hooks/useMyTokenId";
import { useMyTokenMetadata } from "@/hooks/useMyTokenMetadata";
import { useReadBalance } from "@/hooks/useReadBalance";
import { getFreeGas } from "@/utils/freeGas";
import { readTextFromNFC } from "@/utils/nfc";
import { usePrivy } from "@privy-io/react-auth";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { keccak256, stringToBytes } from "viem";
import { useReadContract, useWriteContract } from "wagmi";

export default function EncounteredPage() {
  const { tokenId } = useParams() as { tokenId: string };
  const { authenticated, user, login } = usePrivy();
  const router = useRouter();
  const [status, setStatus] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [hasMyToken, setHasMyToken] = useState<boolean>();

  const { data: balanceData } = useReadBalance();
  const { data: tokenOfOwnerData } = useMyTokenId(balanceData);
  const { tokenURI } = useMyTokenMetadata(tokenId, true);

  const { data: encounterCollectionAddress } = useReadContract({
    ...EncountersFactoryABIAddress,
    functionName: "getCollection",
    args: [Number(tokenId)],
    query: {
      enabled:
        authenticated && !!user?.wallet?.address && !isNaN(Number(tokenId)),
    },
  });

  useEffect(() => {
    if (authenticated && tokenOfOwnerData !== undefined) {
      if ((tokenOfOwnerData as bigint).toString() == tokenId) {
        setHasMyToken(true);
        router.push("/account");
      } else {
        setHasMyToken(false);
      }
    } else if ((balanceData as bigint) == BigInt(0)) {
      setHasMyToken(false);
    }
  }, [authenticated, tokenOfOwnerData, router, tokenId, balanceData]);

  const configMintEncounter = {
    ...EncountersCollectionABIAddress,
    address: encounterCollectionAddress as `0x${string}`,
    functionName: "mintEncounter",
    args: [],
  };

  const { writeContract } = useWriteContract();

  const handleEncounter = async () => {
    if (!authenticated || !user?.wallet) {
      alert("Please login");
      return;
    }

    if (!encounterCollectionAddress || !tokenURI) {
      alert("Invalid encounter data");
      return;
    }

    setLoading(true);
    setStatus("Reading data from the NFC card...");

    const secretToken = await readTextFromNFC();

    if (!secretToken) {
      setStatus("Data not found");
      setLoading(false);
      return;
    }

    const tokenHash = keccak256(stringToBytes(secretToken));

    setStatus("Creating your encounter...");

    try {
      await getFreeGas(user.wallet.address);
    } catch (e) {
      console.warn(e);
    }

    writeContract?.(
      {
        ...configMintEncounter,
        args: [user.wallet.address, tokenURI, tokenHash],
      },
      {
        onSuccess: () => {
          setStatus("Encounter created successfully!");
          setLoading(false);
          router.push("/account");
          // TODO: toast message
        },
        onError: (e) => {
          console.error(e);
          setStatus("Failed to create encounter");
          setLoading(false);
        },
      }
    );
  };

  return (
    <div className="pt-16 pb-8">
      <div className="w-11/12 max-w-xl mx-auto">
        <h1 className="text-5xl font-bold text-sky-400 mb-12">Encountered</h1>
        <Card className="p-4">
          {!authenticated ? (
            <div className="text-center">
              <Button onClick={login}>Login</Button>
            </div>
          ) : loading || hasMyToken === undefined ? (
            <div className="flex flex-col items-center justify-center h-48">
              <Spinner />
              {status && <p className="mt-4">{status}</p>}
            </div>
          ) : hasMyToken === false ? (
            <div className="text-center py-2">
              <MyToken tokenId={tokenId} />
              <Button onClick={handleEncounter} className="mt-5 font-bold">
                Scan the NFC card and get an Encounter
              </Button>
              {status && <p className="mt-2">{status}</p>}
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
