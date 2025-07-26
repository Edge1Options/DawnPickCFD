// 交易相关类型定义
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
}

export interface CFDContract {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'index';
  price: number;
  change: number;
  changePercent: number;
  leverage: number[];
  minTradeAmount: number;
  maxTradeAmount: number;
}

export interface Position {
  id: string;
  contractId: string;
  symbol: string;
  side: 'long' | 'short';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  leverage: number;
  pnl: number;
  pnlPercent: number;
  margin: number;
  timestamp: number;
}

export interface Order {
  id: string;
  contractId: string;
  symbol: string;
  side: 'long' | 'short';
  type: 'market' | 'limit';
  quantity: number;
  price?: number;
  leverage: number;
  stopLoss?: number;
  takeProfit?: number;
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: number;
}

export interface WalletInfo {
  address: string;
  balance: number;
  connected: boolean;
  walletType: 'plug' | 'stoic' | 'cycles' | null;
}

export interface MarketData {
  timestamp: number;
  contracts: CFDContract[];
}

export interface TradingState {
  selectedContract: CFDContract | null;
  positions: Position[];
  orders: Order[];
  wallet: WalletInfo;
  marketData: MarketData | null;
  isLoading: boolean;
  error: string | null;
}