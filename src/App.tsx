import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useMediaQuery } from '@mui/material';
import { WalletProvider } from './hooks/useWallet';
import { MarketDataProvider } from './hooks/useMarketData';
import { TradingStateProvider } from './hooks/useTradingState';
import Header from './components/Header/Header';
import TradingDashboard from './components/TradingPanel/TradingDashboard';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#00d4ff',
      },
      secondary: {
        main: '#ff6b35',
      },
      background: {
        default: '#0a0a0a',
        paper: '#1a1a1a',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 12,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WalletProvider>
        <MarketDataProvider>
          <TradingStateProvider>
            <div className="App">
              <Header />
              <main>
                <TradingDashboard />
              </main>
            </div>
          </TradingStateProvider>
        </MarketDataProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;