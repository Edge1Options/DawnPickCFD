import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
  connected: boolean;
  address: string | null;
  balance: number;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(10000);

  const connect = () => {
    setAddress('mock-wallet-address');
    setConnected(true);
    setBalance(10000 + Math.random() * 5000);
  };

  const disconnect = () => {
    setConnected(false);
    setAddress(null);
    setBalance(0);
  };

  const value = {
    connected,
    address,
    balance,
    connect,
    disconnect
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};