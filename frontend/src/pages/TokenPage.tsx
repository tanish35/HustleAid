"use client";

import { useAccount, useReadContract } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Utensils, Heart, Bus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { abi } from "@/lib/abi";
import { useUser } from "@/hooks/useUser";
import { motion } from "framer-motion";

const CONTRACT_ADDRESS: `0x${string}` =
  (import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`) || "0x";

const TOKEN_TYPES = [
  {
    id: 1,
    name: "Loan",
    icon: CreditCard,
    description: "Financial assistance",
  },
  { id: 2, name: "Food", icon: Utensils, description: "Meal support" },
  { id: 3, name: "Healthcare", icon: Heart, description: "Medical aid" },
  {
    id: 4,
    name: "Transportation",
    icon: Bus,
    description: "Travel assistance",
  },
];

interface TokenType {
  id: number;
  name: string;
  icon: React.ElementType;
  description: string;
}

interface TokenCardProps {
  token: TokenType;
  count: number | bigint | null;
  isLoading: boolean;
}

 const TokenCard = ({ token, count, isLoading }: TokenCardProps) => {
  const Icon = token.icon;
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.3)" }}
      className="group shine-hover h-full"
    >
      <Card className="h-full overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card to-accent/5 shadow-lg transition-all duration-300 hover:border-primary/50">
        <CardHeader className="pb-2 pt-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-primary-bg group-hover:bg-primary/20 transition-colors duration-300">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold text-card-foreground">
                  {token.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {token.description}
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="pt-4 pb-6">
          {isLoading ? (
            <Skeleton className="h-12 w-24" />
          ) : (
            <div className="space-y-1.5">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-primary to-primary/80">
                {count ? Number(count).toString() : "0"}
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Tokens Available
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TokensPage = () => {
  const { address } = useAccount();
  const { loadingUser, userDetails } = useUser();

  const { data: tokens = [0, 0, 0, 0], isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getAllTokensOfOwner",
    args: [address!],
  }) as { data: number[] | bigint[]; isLoading: boolean };

  if (!address) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <Card className="w-full max-w-md backdrop-blur-lg bg-background/60 border border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground text-center">
              Connect Your Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Please connect your wallet to view your tokens.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loadingUser || isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-12 bg-muted rounded-lg w-1/3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {TOKEN_TYPES.map((token) => (
              <div
                key={token.id}
                className="h-48 bg-muted rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            {userDetails ? userDetails.name : "User"}'s Tokens
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            View and manage your assistance tokens
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {TOKEN_TYPES.map((token, index) => (
            <Link to={`/transactions/${token.id}`} key={token.id} className="h-full">
              <TokenCard
                token={token}
                count={tokens && tokens[index]}
                isLoading={isLoading}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokensPage;
