import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Position, Order } from '../types';

interface PlaceOrderParams {
  contractId: string;
  symbol: string;
  side: 'long' | 'short';
  type: 'market' | 'limit';
  quantity: number;
  price?: number;
  leverage: number;
  stopLoss?: number;
  takeProfit?: number;
}

interface TradingStateContextType {
  positions: Position[];
  orders: Order[];
  placeOrder: (params: PlaceOrderParams) => Promise<void>;
  closePosition: (positionId: string) => void;
  cancelOrder: (orderId: string) => void;
}

const TradingStateContext = createContext<TradingStateContextType | undefined>(undefined);

export const useTradingState = () => {
  const context = useContext(TradingStateContext);
  if (!context) {
    throw new Error('useTradingState must be used within a TradingStateProvider');
  }
  return context;
};

interface TradingStateProviderProps {
  children: ReactNode;
}

export const TradingStateProvider: React.FC<TradingStateProviderProps> = ({ children }) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const placeOrder = async (params: PlaceOrderParams): Promise<void> => {
    const newOrder: Order = {
      id: Date.now().toString(),
      contractId: params.contractId,
      symbol: params.symbol,
      side: params.side,
      type: params.type,
      quantity: params.quantity,
      price: params.price,
      leverage: params.leverage,
      stopLoss: params.stopLoss,
      takeProfit: params.takeProfit,
      status: 'pending',
      timestamp: Date.now()
    };

    setOrders(prev => [...prev, newOrder]);

    // Simulate order execution
    setTimeout(() => {
      setOrders(prev => 
        prev.map(order => 
          order.id === newOrder.id 
            ? { ...order, status: 'filled' as const }
            : order
        )
      );

      // Create position for filled order
      const newPosition: Position = {
        id: Date.now().toString(),
        contractId: params.contractId,
        symbol: params.symbol,
        side: params.side,
        quantity: params.quantity,
        entryPrice: params.price || 100, // Mock price
        currentPrice: params.price || 100,
        leverage: params.leverage,
        pnl: 0,
        pnlPercent: 0,
        margin: (params.quantity * (params.price || 100)) / params.leverage,
        timestamp: Date.now()
      };

      setPositions(prev => [...prev, newPosition]);
    }, 1000);
  };

  const closePosition = (positionId: string) => {
    setPositions(prev => prev.filter(position => position.id !== positionId));
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' as const }
          : order
      )
    );
  };

  const value = {
    positions,
    orders,
    placeOrder,
    closePosition,
    cancelOrder
  };

  return (
    <TradingStateContext.Provider value={value}>
      {children}
    </TradingStateContext.Provider>
  );
};