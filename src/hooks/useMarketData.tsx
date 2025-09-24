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
    // Mock market data with 2025 September prices
    const mockContracts: CFDContract[] = [
      {
        id: '1',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        type: 'stock',
        price: 245.62,
        change: 7.74,
        changePercent: 3.26,
        leverage: [1, 2, 5, 10],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '2',
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        type: 'stock',
        price: 255.53,
        change: 3.20,
        changePercent: 1.27,
        leverage: [1, 2, 5, 10],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '3',
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF',
        type: 'index',
        price: 578.45,
        change: 4.21,
        changePercent: 0.73,
        leverage: [1, 2, 5, 10, 20],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '4',
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        type: 'stock',
        price: 176.84,
        change: 0.60,
        changePercent: 0.34,
        leverage: [1, 2, 5, 10],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '5',
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        type: 'stock',
        price: 517.74,
        change: 9.28,
        changePercent: 1.82,
        leverage: [1, 2, 5, 10],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '6',
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        type: 'stock',
        price: 231.75,
        change: 0.52,
        changePercent: 0.22,
        leverage: [1, 2, 5, 10],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '7',
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        type: 'stock',
        price: 434.09,
        change: 9.46,
        changePercent: 2.23,
        leverage: [1, 2, 5, 10, 20],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '8',
        symbol: 'ORCL',
        name: 'Oracle Corporation',
        type: 'stock',
        price: 142.85,
        change: 4.28,
        changePercent: 3.09,
        leverage: [1, 2, 5, 10],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '9',
        symbol: 'PYPL',
        name: 'PayPal Holdings Inc.',
        type: 'stock',
        price: 89.67,
        change: 2.94,
        changePercent: 3.39,
        leverage: [1, 2, 5, 10],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '10',
        symbol: 'MSTR',
        name: 'MicroStrategy Incorporated',
        type: 'stock',
        price: 1847.32,
        change: 26.54,
        changePercent: 1.46,
        leverage: [1, 2, 5, 10, 20],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '11',
        symbol: 'UKX',
        name: 'FTSE 100 Index',
        type: 'index',
        price: 8234.56,
        change: 39.13,
        changePercent: 0.48,
        leverage: [1, 2, 5, 10, 20],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '12',
        symbol: 'DAX',
        name: 'DAX Performance Index',
        type: 'index',
        price: 18567.89,
        change: 87.25,
        changePercent: 0.47,
        leverage: [1, 2, 5, 10, 20],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '13',
        symbol: 'SHCOMP',
        name: 'Shanghai Composite Index',
        type: 'index',
        price: 3156.78,
        change: 21.11,
        changePercent: 0.67,
        leverage: [1, 2, 5, 10, 20],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '14',
        symbol: 'HSI',
        name: 'Hang Seng Index',
        type: 'index',
        price: 17892.45,
        change: 56.67,
        changePercent: 0.32,
        leverage: [1, 2, 5, 10, 20],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '15',
        symbol: 'N225',
        name: 'Nikkei 225 Index',
        type: 'index',
        price: 38456.23,
        change: 75.93,
        changePercent: 0.20,
        leverage: [1, 2, 5, 10, 20],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '16',
        symbol: 'KOSPI',
        name: 'KOSPI Composite Index',
        type: 'index',
        price: 3395.54,
        change: 51.81,
        changePercent: 1.55,
        leverage: [1, 2, 5, 10, 20],
        minTradeAmount: 100,
        maxTradeAmount: 100000
      },
      {
        id: '17',
        symbol: 'NZ50',
        name: 'S&P/NZX 50 Index',
        type: 'index',
        price: 12678.90,
        change: 43.45,
        changePercent: 0.34,
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