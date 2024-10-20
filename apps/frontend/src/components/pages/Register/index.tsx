"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { keccak256, stringToBytes } from "viem";
import { v4 as uuidv4 } from "uuid";
import { writeDataToNFC } from "@/utils/nfc";
import { Spinner } from "@/components/ui/spinner";
import { SITE_URL } from "@/constants/config";
import { uploadMetadataToIPFS } from "@/utils/ipfs";
import {
  EncountersFactoryABIAddress,
  MyTokenABIAddress,
  SecretTokenManagerABIAddress,
} from "@/constants/abiAndAddress";
import { Card } from "@/components/ui/card";
import { getFreeGas } from "@/utils/freeGas";
import { useReadBalance } from "@/hooks/useReadBalance";

export default function RegisterPage() {
  const { authenticated, user, login } = usePrivy();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasMyToken, setHasMyToken] = useState<boolean>();
  const tokenIdRef = useRef<string>();
  const secretTokenRef = useRef<string>();

  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [imageFile, setImageFile] = useState<File>();
  const [collectionName, setCollectionName] = useState<string>();
  const [collectionSymbol, setCollectionSymbol] = useState<string>();
  const [status, setStatus] = useState<string>();

  const { data: balanceData } = useReadBalance();

  useEffect(() => {
    if (authenticated && balanceData !== undefined) {
      if ((balanceData as bigint) > BigInt(0)) {
        setHasMyToken(true);
        router.push("/account");
      } else {
        setHasMyToken(false);
      }
    }
  }, [authenticated, balanceData, router]);

  const { refetch: refetchTokenData } = useReadContract({
    ...MyTokenABIAddress,
    functionName: "tokenOfOwnerByIndex",
    args: [user?.wallet?.address, 0],
    query: {
      enabled:
        authenticated && !!balanceData && (balanceData as bigint) > BigInt(0),
    },
  });

  const configMintMyToken = {
    ...MyTokenABIAddress,
    functionName: "mintMyToken",
    args: [],
  };

  const configCreateCollection = {
    ...EncountersFactoryABIAddress,
    functionName: "createCollection",
    args: [],
  };

  const configRegisterToken = {
    ...SecretTokenManagerABIAddress,
    functionName: "registerToken",
    args: [],
  };

  const { writeContract } = useWriteContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authenticated || !user?.wallet) {
      alert("Please login");
      return;
    }

    if (
      !name ||
      !description ||
      !imageFile ||
      !collectionName ||
      !collectionSymbol
    ) {
      alert("Please fill out all fields");
      return;
    }

    setLoading(true);
    setStatus("Uploading metadata to IPFS...");

    const tokenURI = await uploadMetadataToIPFS(name, description, imageFile);
    if (!tokenURI) {
      setStatus("Failed uploading metadata to IPFS");
      setLoading(false);
      return;
    }

    setStatus("Creating MyToken...");

    try {
      await getFreeGas(user.wallet.address);
    } catch (e) {
      console.warn(e);
    }

    writeContract?.(
      {
        ...configMintMyToken,
        args: [user.wallet.address, tokenURI],
      },
      {
        onSuccess: () => {
          createCollection();
        },
        onError: (e) => {
          console.error(e);
          setStatus("Falied to create MyToken");
          setLoading(false);
        },
      }
    );
  };

  const createCollection = async () => {
    const { data: tokenIdData } = await refetchTokenData();

    if (typeof tokenIdData !== "bigint") {
      setStatus("Failed to get tokenId");
      setLoading(false);
      return;
    }

    tokenIdRef.current = tokenIdData.toString();

    setStatus("Creating your encounters collection...");

    writeContract?.(
      {
        ...configCreateCollection,
        args: [Number(tokenIdRef.current), collectionName, collectionSymbol],
      },
      {
        onSuccess: () => {
          registerToken();
        },
        onError: (e) => {
          console.error(e);
          setStatus("Falied to create encounters collection");
          setLoading(false);
        },
      }
    );
  };

  const registerToken = async () => {
    setStatus("Generating secret token...");

    const secretToken = uuidv4();
    secretTokenRef.current = secretToken;
    const tokenHash = keccak256(stringToBytes(secretToken));
    const doubleHash = keccak256(tokenHash);

    setStatus("Registering secret token...");

    writeContract?.(
      {
        ...configRegisterToken,
        args: [doubleHash],
      },
      {
        onSuccess: () => {
          writeNFC();
        },
        onError: (e) => {
          console.error(e);
          setStatus("Failed to register secret token");
          setLoading(false);
        },
      }
    );
  };

  const writeNFC = async () => {
    if (!secretTokenRef.current || !tokenIdRef.current) {
      setStatus("error");
      return;
    }

    setStatus("Writing data to your NFC card...");

    const url = `${SITE_URL}/encountered/${tokenIdRef.current}`;
    const nfcData = {
      url,
      secretToken: secretTokenRef.current,
    };
    await writeDataToNFC(nfcData);

    setStatus("Registration completed!");
    setLoading(false);

    router.push("/account");
    // TODO: toast message
  };

  return (
    <div className="py-16">
      <div className="w-11/12 max-w-xl mx-auto">
        <h1 className="text-5xl font-bold text-sky-400 mb-12">Register</h1>
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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name" className="font-bold">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description" className="font-bold">
                  Introduction
                </Label>
                <Textarea
                  id="description"
                  placeholder="Intorduce yourself"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="image" className="font-bold">
                  Image
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  required
                />
              </div>
              <div>
                <Label htmlFor="collection_name" className="font-bold">
                  Encounters Collection Name
                </Label>
                <Input
                  id="collection_name"
                  type="text"
                  placeholder="Your Encounters Collection Name"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="collection_symbol" className="font-bold">
                  Encounters Collection Symbol{" "}
                  <small>(ex: ETH, BTC, SOL)</small>
                </Label>
                <Input
                  id="collection_symbol"
                  type="text"
                  placeholder="Your Encounters Collection Symbol"
                  value={collectionSymbol}
                  onChange={(e) => setCollectionSymbol(e.target.value)}
                  required
                />
              </div>
              <div className="text-center">
                <Button type="submit" className="mt-3 font-bold">
                  Create your MyToken and register
                </Button>
              </div>
              {status && <p className="mt-2">{status}</p>}
            </form>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
