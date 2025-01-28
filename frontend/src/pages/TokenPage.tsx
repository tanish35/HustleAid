import { useAccount, useReadContract } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Utensils, Heart, Bus } from 'lucide-react';
import { motion } from "framer-motion";

const CONTRACT_ADDRESS = "0xA50C611942886c7F04bD8BAFDF6353a3794fe8c6";

const TOKEN_TYPES = [
  { id: 0, name: "Loan", icon: CreditCard, description: "Financial assistance token" },
  { id: 1, name: "Food", icon: Utensils, description: "Food assistance token" },
  { id: 2, name: "Healthcare", icon: Heart, description: "Healthcare assistance token" },
  { id: 3, name: "Transportation", icon: Bus, description: "Transportation assistance token" },
];

const TokensPage = () => {
  const { address } = useAccount();

  const { data: tokens, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: [{
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "getAllTokensOfOwner",
      outputs: [{ internalType: "uint256[4]", name: "", type: "uint256[4]" }],
      stateMutability: "view",
      type: "function",
    }],
    functionName: "getAllTokensOfOwner",
    args: [address!],
  });

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground text-lg">Please connect your wallet to view your tokens.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">My Tokens</h1>
          <p className="text-xl text-muted-foreground">
            View and manage your assistance tokens
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TOKEN_TYPES.map((token, index) => {
            const Icon = token.icon;
            return (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="space-y-1 bg-gradient-to-r from-primary/10 to-primary/5">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-6 w-6 text-primary" />
                      <CardTitle>{token.name}</CardTitle>
                    </div>
                    <CardDescription>{token.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {isLoading ? (
                      <Skeleton className="h-12 w-24" />
                    ) : (
                      <div className="text-4xl font-bold text-primary">
                        {tokens ? tokens[index].toString() : "0"}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">Tokens Available</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default TokensPage;