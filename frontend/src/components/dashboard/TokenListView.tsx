import { TokenType } from "@/types";
import { motion } from "framer-motion";
import { Coins, ArrowRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenViewData {
  id: number;
  name: TokenType;
  count: number;
  status: 'active' | 'pending' | 'expired';
  lastUsed?: Date;
}

interface TokenListViewProps {
  tokens: TokenViewData[];
  onTokenClick: (id: number) => void;
}

export const TokenListView = ({ tokens, onTokenClick }: TokenListViewProps) => {
  return (
    <div className="space-y-4">
      {tokens.map((token, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          key={token.id}
          onClick={() => onTokenClick(token.id)}
          className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-all hover:scale-[1.02] border border-transparent hover:border-primary/20"
        >
          <div className="flex items-center space-x-4">
            <div className={cn(
              "p-2 rounded-full",
              token.status === 'active' ? "bg-green-500/20" : 
              token.status === 'pending' ? "bg-yellow-500/20" : "bg-red-500/20"
            )}>
              <Coins className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="font-medium">{token.name}</span>
              <p className="text-xs text-muted-foreground">{token.description}</p>
              {token.lastUsed && (
                <p className="text-xs text-muted-foreground">
                  Last used: {new Date(token.lastUsed).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-semibold">{token.count}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
