import { useState } from "react";
import { useConnect, useDisconnect, useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Clipboard, Menu, X, Wallet } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const { connect, connectors: availableConnectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected: accountConnected, address } = useAccount();
  const location = useLocation();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `Wallet address ${text} copied to clipboard`,
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-gradient-to-b from-background/95 to-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex gap-4 items-center">
            <Link 
              to="/" 
              className="flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:opacity-80"
            >
              <Wallet className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">DeFi Tokens</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <nav className="hidden md:flex space-x-6">
              {[
                { path: "/", label: "Home" },
                { path: "/tokens", label: "My Tokens" },
                { path: "/marketplace", label: "MarketPlace" },
                { path: "/about", label: "About" }
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "transition-all duration-200 hover:text-primary relative py-1 px-2 rounded-md",
                    "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-200",
                    "hover:after:w-full",
                    isActivePath(path) && "text-primary after:w-full bg-primary/10"
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-row items-center hidden md:flex gap-4">
            {!accountConnected ? (
             availableConnectors.slice(2, 3).map((connector) => (
                <Button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  variant="outline"
                  className="relative overflow-hidden group hover:border-primary transition-colors duration-300"
                >
                  <span className="relative z-10 group-hover:text-background transition-colors duration-300">
                    Connect Metamask
                  </span>
                  <span className="absolute inset-0 transform translate-y-[101%] group-hover:translate-y-0 bg-gradient-to-r from-primary to-primary/80 transition-transform duration-300 ease-out" />
                </Button>
              ))
            ) : (
              <div className="flex items-center gap-2 bg-gradient-to-r from-muted/80 to-muted/40 rounded-lg px-3 py-1.5 shadow-sm">
                <span className="text-sm font-medium">{truncateAddress(address!)}</span>
                <Button
                  onClick={() => handleCopy(address!)}
                  className="h-8 w-8 p-0 hover:bg-muted"
                  variant="ghost"
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <Button onClick={() => disconnect()} variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>
            )}
            <ModeToggle />
          </div>

          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <nav className="flex flex-col space-y-2 py-4">
                {[
                  { path: "/", label: "Home" },
                  { path: "/tokens", label: "My Tokens" },
                  { path: "/marketplace", label: "MarketPlace" },
                  { path: "/about", label: "About" }
                ].map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={cn(
                      "px-4 py-2.5 hover:bg-muted rounded-lg transition-all duration-200",
                      "hover:translate-x-1",
                      isActivePath(path) && "bg-primary/10 text-primary font-medium"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              
              <div className="flex flex-col space-y-4 p-4 border-t border-border/50">
                {!accountConnected ? (
                  availableConnectors.map((connector) => (
                    <Button
                      key={connector.id}
                      onClick={() => connect({ connector })}
                      variant="outline"
                      className="w-full"
                    >
                      Connect Wallet
                    </Button>
                  ))
                ) : (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{truncateAddress(address!)}</span>
                      <Button
                        onClick={() => handleCopy(address!)}
                        className="h-8 w-8 p-0 hover:bg-muted"
                        variant="ghost"
                      >
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={() => disconnect()} variant="outline" className="w-full">
                      Disconnect
                    </Button>
                  </div>
                )}
                <ModeToggle />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;