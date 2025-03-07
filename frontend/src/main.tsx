import { Buffer } from "buffer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { ThemeProvider } from "./components/Providers";
import { Toaster } from "./components/ui/toaster.tsx";

import App from "./App.tsx";
import { config } from "./wagmi.ts";
import axios from "axios";

import "./index.css";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipProvider } from "./components/ui/tooltip.tsx";

globalThis.Buffer = Buffer;

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = BACKEND_URL;
axios.defaults.withCredentials = true;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" enableSystem>
      <TooltipProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster />
        </QueryClientProvider>
      </WagmiProvider>
      </TooltipProvider>
    </ThemeProvider>
  </React.StrictMode>
);
