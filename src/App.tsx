import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { WalletProvider } from './hooks/useWallet';
import { MarketDataProvider } from './hooks/useMarketData';
import { TradingStateProvider } from './hooks/useTradingState';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { LanguageProvider } from './hooks/useLanguage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import TradingDashboard from './components/TradingPanel/TradingDashboard';

const AppContent: React.FC = () => {
  const { mode } = useTheme();
  
  // DawnPickCFD 品牌色系主题配置
  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: '#C8AA6E', // 科技金
        light: '#D4B87A',
        dark: '#B89A5E',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#6366F1', // 数字紫
        light: '#7C7FF5',
        dark: '#4F46E5',
        contrastText: '#FFFFFF',
      },
      background: {
        default: mode === 'dark' ? '#0F172A' : '#F8FAFC', // 深空蓝 / 浅色背景
        paper: mode === 'dark' ? '#1E293B' : '#FFFFFF', // 沉稳灰 / 白色
      },
      text: {
        primary: mode === 'dark' ? '#E2E8F0' : '#1E293B', // 科技银 / 沉稳灰
        secondary: mode === 'dark' ? '#94A3B8' : '#64748B', // 次要文本
      },
      error: {
        main: '#F59E0B', // 警示金
        light: '#FCD34D',
        dark: '#D97706',
      },
      warning: {
        main: '#F59E0B', // 警示金
        light: '#FCD34D',
        dark: '#D97706',
      },
      info: {
        main: '#6366F1', // 数字紫
        light: '#7C7FF5',
        dark: '#4F46E5',
      },
      success: {
        main: '#10B981', // 成功绿色
        light: '#34D399',
        dark: '#059669',
      },
      divider: mode === 'dark' ? 'rgba(200, 170, 110, 0.2)' : 'rgba(30, 41, 59, 0.12)',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica Neue", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
        color: mode === 'dark' ? '#C8AA6E' : '#1E293B',
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
        lineHeight: 1.3,
        color: mode === 'dark' ? '#C8AA6E' : '#1E293B',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
        color: mode === 'dark' ? '#E2E8F0' : '#1E293B',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
        color: mode === 'dark' ? '#E2E8F0' : '#1E293B',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.4,
        color: mode === 'dark' ? '#E2E8F0' : '#1E293B',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.4,
        color: mode === 'dark' ? '#E2E8F0' : '#1E293B',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        color: mode === 'dark' ? '#E2E8F0' : '#1E293B',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        color: mode === 'dark' ? '#94A3B8' : '#64748B',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(200, 170, 110, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)'
              : 'rgba(255, 255, 255, 0.9)',
            border: mode === 'dark' 
              ? '1px solid rgba(200, 170, 110, 0.2)'
              : '1px solid rgba(30, 41, 59, 0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: mode === 'dark' ? '#C8AA6E' : '#6366F1',
              boxShadow: mode === 'dark' 
                ? '0 8px 32px rgba(200, 170, 110, 0.1)'
                : '0 8px 32px rgba(99, 102, 241, 0.1)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
            textTransform: 'none',
            transition: 'all 0.3s ease',
          },
          contained: {
            background: 'linear-gradient(135deg, #C8AA6E 0%, #6366F1 100%)',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(200, 170, 110, 0.2)',
            '&:hover': {
              background: 'linear-gradient(135deg, #D4B87A 0%, #7C7FF5 100%)',
              boxShadow: '0 8px 25px rgba(200, 170, 110, 0.3)',
              transform: 'translateY(-2px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          outlined: {
            borderColor: '#C8AA6E',
            color: '#C8AA6E',
            '&:hover': {
              borderColor: '#6366F1',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: '#6366F1',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              '& fieldset': {
                borderColor: mode === 'dark' ? 'rgba(200, 170, 110, 0.2)' : 'rgba(30, 41, 59, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: mode === 'dark' ? 'rgba(200, 170, 110, 0.5)' : 'rgba(99, 102, 241, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: mode === 'dark' ? '#C8AA6E' : '#6366F1',
                boxShadow: mode === 'dark' 
                  ? '0 0 0 2px rgba(200, 170, 110, 0.1)'
                  : '0 0 0 2px rgba(99, 102, 241, 0.1)',
              },
            },
            '& .MuiInputBase-input': {
              color: mode === 'dark' ? '#E2E8F0' : '#1E293B',
            },
            '& .MuiInputLabel-root': {
              color: mode === 'dark' ? '#94A3B8' : '#64748B',
              '&.Mui-focused': {
                color: mode === 'dark' ? '#C8AA6E' : '#6366F1',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
          },
          filled: {
            backgroundColor: mode === 'dark' ? 'rgba(200, 170, 110, 0.2)' : 'rgba(99, 102, 241, 0.1)',
            color: mode === 'dark' ? '#C8AA6E' : '#6366F1',
          },
          outlined: {
            borderColor: mode === 'dark' ? '#C8AA6E' : '#6366F1',
            color: mode === 'dark' ? '#C8AA6E' : '#6366F1',
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            color: '#C8AA6E',
            '& .MuiSlider-thumb': {
              backgroundColor: '#C8AA6E',
              border: '2px solid #FFFFFF',
              boxShadow: '0 2px 8px rgba(200, 170, 110, 0.3)',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(200, 170, 110, 0.4)',
              },
            },
            '& .MuiSlider-track': {
              background: 'linear-gradient(90deg, #C8AA6E 0%, #6366F1 100%)',
            },
            '& .MuiSlider-rail': {
              backgroundColor: mode === 'dark' ? 'rgba(200, 170, 110, 0.2)' : 'rgba(99, 102, 241, 0.2)',
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            '& .MuiTab-root': {
              color: mode === 'dark' ? '#94A3B8' : '#64748B',
              fontWeight: 500,
              '&.Mui-selected': {
                color: mode === 'dark' ? '#C8AA6E' : '#6366F1',
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(90deg, #C8AA6E 0%, #6366F1 100%)',
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          },
        },
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <WalletProvider>
        <MarketDataProvider>
          <TradingStateProvider>
            <Box 
              className="App"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                background: mode === 'dark' 
                  ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
                  : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
              }}
            >
              <Header />
              <Box 
                component="main"
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <TradingDashboard />
              </Box>
              <Footer />
            </Box>
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