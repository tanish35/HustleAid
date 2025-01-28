import { useAccount, useReadContract } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Utensils, Heart, Bus } from "lucide-react";
import { Link } from "react-router-dom";
import { abi } from "@/lib/abi";

const CONTRACT_ADDRESS = "0xA50C611942886c7F04bD8BAFDF6353a3794fe8c6";

const TOKEN_TYPES = [
  {
    id: 1,
    name: "Loan",
    icon: CreditCard,
    description: "Financial assistance token",
  },
  { id: 2, name: "Food", icon: Utensils, description: "Food assistance token" },
  {
    id: 3,
    name: "Healthcare",
    icon: Heart,
    description: "Healthcare assistance token",
  },
  {
    id: 4,
    name: "Transportation",
    icon: Bus,
    description: "Transportation assistance token",
  },
];

const TokensPage = () => {
  const { address } = useAccount();

  const { data: tokens, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getAllTokensOfOwner",
    args: [address!],
  }) as { data: number[] | bigint[]; isLoading: boolean };

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground">
            Please connect your wallet to view your tokens.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tokens</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your assistance tokens
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOKEN_TYPES.map((token, index) => {
            const Icon = token.icon;
            return (
              <Link to={`/transactions/${token.id}`} key={token.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5" />
                      <CardTitle>{token.name}</CardTitle>
                    </div>
                    <CardDescription>{token.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <div className="text-2xl font-bold">
                        {tokens ? tokens[index].toString() : "0"}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      Tokens Available
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TokensPage;
