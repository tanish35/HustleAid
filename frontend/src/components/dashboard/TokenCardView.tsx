import { TokenType } from "@/types";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Coins, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenViewData {
  id: number;
  name: TokenType;
  count: number;
  status: 'active' | 'pending' | 'expired';
  lastUsed?: Date;
  description?: string;
}

interface TokenCardViewProps {
  tokens: TokenViewData[];
  onTokenClick: (id: number) => void;
}

export const TokenCardView = ({ tokens, onTokenClick }: TokenCardViewProps) => {
  const getStatusColor = (status: TokenViewData['status']) => {
    switch (status) {
      case 'active': return "bg-green-500/10 text-green-600 dark:text-green-400";
      case 'pending': return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case 'expired': return "bg-red-500/10 text-red-600 dark:text-red-400";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {tokens.map((token, index) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          key={token.id}
        >
          <Card
            onClick={() => onTokenClick(token.id)}
            className="cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.02] border overflow-hidden group"
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className={cn(
                    "p-2 rounded-lg",
                    getStatusColor(token.status)
                  )}>
                    <Coins className="w-4 h-4" />
                  </div>
                  <div className="flex items-center space-x-1.5 bg-secondary/80 px-2 py-1 rounded-full">
                    <Activity className="w-3 h-3" />
                    <span className="font-medium text-sm">{token.count}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-medium text-base group-hover:text-primary transition-colors">
                    {token.name}
                  </h3>
                  {token.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {token.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "capitalize text-xs",
                      getStatusColor(token.status)
                    )}
                  >
                    {token.status}
                  </Badge>
                  {token.lastUsed && (
                    <p className="text-[11px] text-muted-foreground">
                      Last used: {new Date(token.lastUsed).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
