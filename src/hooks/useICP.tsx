import React, { ReactNode } from 'react';
import { WalletProvider } from './useWallet';
import { MarketDataProvider } from './useMarketData';
import { TradingStateProvider } from './useTradingState';

interface ICPProviderProps {
  children: ReactNode;
}

export const ICPProvider: React.FC<ICPProviderProps> = ({ children }) => {
  return (
    <WalletProvider>
      <MarketDataProvider>
        <TradingStateProvider>
          {children}
        </TradingStateProvider>
      </MarketDataProvider>
    </WalletProvider>
  );
};