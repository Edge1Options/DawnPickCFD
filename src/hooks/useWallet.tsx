import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth';

interface WalletContextType {
  connected: boolean;
  address: string | null;
  accountId: string | null;
  balance: number;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
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
  const [accountId, setAccountId] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      await authService.init();
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const principal = authService.getPrincipal();
        const account = authService.getAccountId();
        setAddress(principal);
        setAccountId(account);
        setConnected(true);
        // Simulate getting balance
        setBalance(10000 + Math.random() * 5000);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    }
  };

  const connect = async () => {
    if (connecting) return;
    
    setConnecting(true);
    try {
      const success = await authService.login();
      if (success) {
        const principal = authService.getPrincipal();
        const account = authService.getAccountId();
        setAddress(principal);
        setAccountId(account);
        setConnected(true);
        // Simulate getting balance
        setBalance(10000 + Math.random() * 5000);
      }
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await authService.logout();
      setConnected(false);
      setAddress(null);
      setAccountId(null);
      setBalance(0);
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  const value = {
    connected,
    address,
    accountId,
    balance,
    connecting,
    connect,
    disconnect
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};