import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { WalletProvider } from './hooks/useWallet';
import { MarketDataProvider } from './hooks/useMarketData';
import { TradingStateProvider } from './hooks/useTradingState';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { LanguageProvider } from './hooks/useLanguage';
import Header from './components/Header/Header';
import TradingDashboard from './components/TradingPanel/TradingDashboard';

const AppContent: React.FC = () => {
  const { mode } = useTheme();
  
  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: '#00d4ff',
      },
      secondary: {
        main: '#ff6b35',
      },
      background: {
        default: mode === 'dark' ? '#0a0a0a' : '#f5f5f5',
        paper: mode === 'dark' ? '#1a1a1a' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#000000',
        secondary: mode === 'dark' ? '#b0b0b0' : '#666666',
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
    <MuiThemeProvider theme={theme}>
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
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;