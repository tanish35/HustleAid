import { useState, useEffect } from "react";
import axios from "axios";
import { useConnect, useDisconnect, useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Clipboard, Menu, X, Wallet, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
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
  const { theme, setTheme } = useTheme();

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

  useEffect(() => {
    if (accountConnected && address) {
      updateWalletAddress(address);
    }
  }, [accountConnected, address]);

  const updateWalletAddress = async (walletAddress: string) => {
    try {
      const response = await axios.post(
        `/auth/updatewallet`,
        { walletAddress },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast({
          title: "Wallet Updated",
          description: "Your wallet address has been successfully updated.",
        });
      }
    } catch (error) {
      console.error("Failed to update wallet address:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update your wallet address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleConnect = async (connector: any) => {
    try {
      await connect({ connector });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: "Disconnected",
        description: "Your wallet has been disconnected.",
      });
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  const WalletButton = () =>
    !accountConnected ? (
      availableConnectors.slice(2, 3).map((connector) => (
        <Button
          key={connector.id}
          onClick={() => handleConnect(connector)}
          variant="outline"
          className="hover:bg-primary/90 hover:text-primary-foreground hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connect Metamask
        </Button>
      ))
    ) : (
      <div className="flex items-center gap-2 bg-muted/50 backdrop-blur rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50">
        <span className="text-sm font-medium bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          {truncateAddress(address!)}
        </span>
        <Button
          onClick={() => handleCopy(address!)}
          className="h-8 w-8 p-0 hover:bg-accent hover:scale-105 transition-all duration-300"
          variant="ghost"
        >
          <Clipboard className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button
          onClick={handleDisconnect}
          variant="ghost"
          className="hover:bg-destructive/90 hover:text-destructive-foreground transition-all duration-300"
        >
          Disconnect
        </Button>
      </div>
    );

  const ModeToggle = () => (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full w-10 h-10 hover:bg-primary hover:text-primary-foreground transition-colors duration-300 hover:shadow-sm hover:scale-105 hover:cursor-pointer click:scale-95"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full py-1 border-b bg-background/50 dark:bg-background/50 backdrop-blur-xl transition-all duration-300 shadow-sm"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10" />
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl relative">
        <div className="flex h-16 items-center justify-between">
          <div className="flex gap-4 items-center">
            <Link
              to="/"
              className="flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:opacity-80"
            >
              <Wallet className="h-6 w-6" />
              <span className="font-bold text-lg">HustleAid</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <nav className="hidden md:flex space-x-6">
              {[
                { path: "/", label: "Home" },
                { path: "/tokens", label: "My Tokens" },
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "transition-all duration-200 hover:text-primary relative py-2 px-2 rounded-md",
                    "after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary",
                    "after:transform after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300",
                    "hover:after:scale-x-100 hover:after:origin-bottom-left",
                    isActivePath(path) &&
                      "text-primary after:scale-x-100 bg-primary/10"
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-row items-center hidden md:flex gap-4">
            <WalletButton />
            <ModeToggle />
          </div>

          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-background/95 backdrop-blur-lg border-t border-border/50"
            >
              <nav className="flex flex-col space-y-2 py-4">
                {[
                  { path: "/", label: "Home" },
                  { path: "/tokens", label: "My Tokens" },
                ].map(({ path, label }) => (
                  <motion.div
                    key={path}
                    whileHover={{ x: 8 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={path}
                      className={cn(
                        "px-4 py-2.5 hover:bg-muted rounded-lg transition-all duration-200 block",
                        "relative after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-primary",
                        "after:transform after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300",
                        "hover:after:scale-x-100 hover:after:origin-bottom-left",
                        isActivePath(path) &&
                          "bg-primary/10 text-primary font-medium after:scale-x-100"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="flex flex-col space-y-4 p-4 border-t border-border/50">
                {!accountConnected ? (
                  availableConnectors.map((connector) => (
                    <Button
                      key={connector.id}
                      onClick={() => handleConnect(connector)}
                      variant="outline"
                      className="w-full hover:bg-primary hover:text-primary-foreground"
                    >
                      Connect Wallet
                    </Button>
                  ))
                ) : (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {truncateAddress(address!)}
                      </span>
                      <Button
                        onClick={() => handleCopy(address!)}
                        className="h-8 w-8 p-0 hover:bg-muted"
                        variant="ghost"
                      >
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={handleDisconnect}
                      variant="outline"
                      className="w-full hover:bg-primary hover:text-primary-foreground"
                    >
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
