import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CFDContract, MarketData } from '../types';

interface MarketDataContextType {
  marketData: MarketData | null;
  selectedContract: CFDContract | null;
  isLoading: boolean;
  selectContract: (contract: CFDContract) => void;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

export const useMarketData = () => {
  const context = useContext(MarketDataContext);
  if (!context) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
};

interface MarketDataProviderProps {
  children: ReactNode;
}

export const MarketDataProvider: React.FC<MarketDataProviderProps> = ({ children }) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [selectedContract, setSelectedContract] = useState<CFDContract | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const selectContract = (contract: CFDContract) => {
    setSelectedContract(contract);
  };

  useEffect(() => {
    // Mock market data
    const mockContracts: CFDContract[] = [
      {
        id: '1',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        type: 'stock',
        price: 175.43,
        change: 2.15,
        changePercent: 1.24,
        leverage: [1, 2, 5, 10],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '2',
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        type: 'stock',
        price: 2847.63,
        change: -15.42,
        changePercent: -0.54,
        leverage: [1, 2, 5, 10],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '3',
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF',
        type: 'index',
        price: 445.67,
        change: 3.21,
        changePercent: 0.72,
        leverage: [1, 2, 5, 10, 20],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      }
    ];

    const mockMarketData: MarketData = {
      timestamp: Date.now(),
      contracts: mockContracts
    };

    setTimeout(() => {
      setMarketData(mockMarketData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const value = {
    marketData,
    selectedContract,
    isLoading,
    selectContract
  };

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
};