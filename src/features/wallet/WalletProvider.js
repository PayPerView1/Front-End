"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getWalletBalance } from "./services/walletService";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [balance, setBalance] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await getWalletBalance();
      if (response?.success === false) throw new Error(response.message || "Unable to load wallet.");
      const wallet = response?.data ?? response;
      const nextBalance = Number(wallet?.balance);
      if (!Number.isFinite(nextBalance)) throw new Error("Wallet response did not include a valid balance.");
      setBalance(nextBalance);
      setError("");
      setStatus("ready");
      return wallet;
    } catch (cause) {
      setError(cause?.message || "Unable to load wallet.");
      setStatus("error");
      throw cause;
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => refresh().catch(() => {}), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const value = { balance, setBalance, status, error, refresh };
  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const wallet = useContext(WalletContext);
  if (!wallet) throw new Error("useWallet must be used within WalletProvider.");
  return wallet;
}
