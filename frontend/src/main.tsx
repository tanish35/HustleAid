import { Buffer } from "buffer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { ThemeProvider } from "./components/Providers";

import App from "./App.tsx";
import { config } from "./wagmi.ts";
import axios from "axios";

import "./index.css";

globalThis.Buffer = Buffer;

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

axios.defaults.baseURL = BACKEND_URL;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" enableSystem>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  </React.StrictMode>
);
