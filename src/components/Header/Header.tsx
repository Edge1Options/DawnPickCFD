import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import {
  AccountBalanceWallet,
  Settings,
  Notifications,
  Language,
  LightMode,
  DarkMode,
  Check,
  ContentCopy,
  AccountBox,
  Fingerprint
} from '@mui/icons-material';
import { useWallet } from '../../hooks/useWallet';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';

const Header: React.FC = () => {
  const { connected, address, accountId, balance, connecting, connect, disconnect } = useWallet();
  const { mode, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  
  const [walletAnchorEl, setWalletAnchorEl] = useState<null | HTMLElement>(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleWalletMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setWalletAnchorEl(event.currentTarget);
  };

  const handleWalletMenuClose = () => {
    setWalletAnchorEl(null);
  };

  const handleSettingsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbarMessage(`${label} copied to clipboard!`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setSnackbarMessage('Failed to copy to clipboard');
      setSnackbarOpen(true);
    }
  };

  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(balance);
  };

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          bgcolor: mode === 'dark' ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${mode === 'dark' ? 'rgba(0, 212, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          color: mode === 'dark' ? '#ffffff' : '#000000'
        }}
      >
        <Toolbar sx={{ minHeight: 70 }}>
          {/* Logo with Edge1 icon */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box 
              component="img" 
              src="/logo-120.jpg" 
              alt="Edge1 Logo" 
              sx={{ 
                width: 40, 
                height: 40, 
                marginRight: 1,
                borderRadius: 1
              }} 
            />
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #00d4ff, #ff6b35)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              DawnPickCFD
            </Typography>
          </Box>
          
          {/* Wallet Section */}
          <Box display="flex" alignItems="center" gap={2}>
            {connected ? (
              <>
                <Chip
                  label={formatBalance(balance)}
                  color="primary"
                  variant="outlined"
                  sx={{
                    background: 'linear-gradient(45deg, rgba(0, 212, 255, 0.1), rgba(255, 107, 53, 0.1))',
                    borderColor: '#00d4ff'
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AccountBalanceWallet />}
                  onClick={handleWalletMenuOpen}
                  sx={{
                    borderColor: '#00d4ff',
                    color: '#00d4ff',
                    '&:hover': {
                      borderColor: '#ff6b35',
                      backgroundColor: 'rgba(255, 107, 53, 0.1)'
                    }
                  }}
                >
                  {formatAddress(address)}
                </Button>
                <Menu
                  anchorEl={walletAnchorEl}
                  open={Boolean(walletAnchorEl)}
                  onClose={handleWalletMenuClose}
                  PaperProps={{
                    sx: {
                      bgcolor: mode === 'dark' ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${mode === 'dark' ? 'rgba(0, 212, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                      minWidth: 350,
                      maxWidth: 400
                    }
                  }}
                >
                  {/* Account ID */}
                  <MenuItem 
                    onClick={() => accountId && copyToClipboard(accountId, 'Account ID')}
                    sx={{ 
                      flexDirection: 'column', 
                      alignItems: 'flex-start',
                      py: 2,
                      '&:hover': {
                        backgroundColor: mode === 'dark' ? 'rgba(0, 212, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <AccountBox fontSize="small" color="primary" />
                      </ListItemIcon>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Account ID
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <ContentCopy fontSize="small" sx={{ color: 'text.secondary' }} />
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        wordBreak: 'break-all',
                        fontSize: '0.75rem',
                        color: 'text.secondary',
                        pl: 4.5,
                        lineHeight: 1.3
                      }}
                    >
                      {accountId || 'Loading...'}
                    </Typography>
                  </MenuItem>
                  
                  <Divider />
                  
                  {/* Principal ID */}
                  // 在第218行附近，将principalId改为address
                  <MenuItem 
                    onClick={() => address && copyToClipboard(address, 'Principal ID')}
                    sx={{ 
                      flexDirection: 'column', 
                      alignItems: 'flex-start',
                      py: 2,
                      '&:hover': {
                        backgroundColor: mode === 'dark' ? 'rgba(0, 212, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Fingerprint fontSize="small" color="secondary" />
                      </ListItemIcon>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                        Principal ID
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <ContentCopy fontSize="small" sx={{ color: 'text.secondary' }} />
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        wordBreak: 'break-all',
                        fontSize: '0.75rem',
                        color: 'text.secondary',
                        pl: 4.5,
                        lineHeight: 1.3
                      }}
                    >
                      {address || 'Loading...'}
                    </Typography>
                  </MenuItem>
                  
                  <Divider />
                  
                  {/* Disconnect */}
                  <MenuItem 
                    onClick={() => {
                      disconnect();
                      handleWalletMenuClose();
                    }}
                    sx={{ 
                      color: '#ff6b35',
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 107, 53, 0.1)'
                      }
                    }}
                  >
                    <ListItemText primary="Disconnect" />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={connecting ? <CircularProgress size={20} color="inherit" /> : <AccountBalanceWallet />}
                onClick={connect}
                disabled={connecting}
                sx={{
                  background: 'linear-gradient(45deg, #00d4ff, #ff6b35)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0099cc, #cc5522)'
                  },
                  '&:disabled': {
                    background: 'rgba(0, 212, 255, 0.3)'
                  }
                }}
              >
                {connecting ? 'Connecting...' : 'Connect Internet Identity'}
              </Button>
            )}

            {/* Settings */}
            <IconButton 
              color="inherit" 
              onClick={handleSettingsMenuOpen}
              sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}
            >
              <Settings />
            </IconButton>
            <Menu
              anchorEl={settingsAnchorEl}
              open={Boolean(settingsAnchorEl)}
              onClose={handleSettingsMenuClose}
              PaperProps={{
                sx: {
                  bgcolor: mode === 'dark' ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${mode === 'dark' ? 'rgba(0, 212, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                  minWidth: 200
                }
              }}
            >
              <MenuItem disabled>
                <ListItemText primary="Theme" sx={{ fontWeight: 'bold' }} />
              </MenuItem>
              <Divider />
              <MenuItem 
                onClick={() => {
                  setTheme('light');
                  handleSettingsMenuClose();
                }}
              >
                <ListItemIcon>
                  <LightMode fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Light" />
                {mode === 'light' && (
                  <ListItemIcon>
                    <Check fontSize="small" color="primary" />
                  </ListItemIcon>
                )}
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  setTheme('dark');
                  handleSettingsMenuClose();
                }}
              >
                <ListItemIcon>
                  <DarkMode fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Dark" />
                {mode === 'dark' && (
                  <ListItemIcon>
                    <Check fontSize="small" color="primary" />
                  </ListItemIcon>
                )}
              </MenuItem>
            </Menu>

            {/* Notifications */}
            <IconButton 
              color="inherit"
              sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}
            >
              <Notifications />
            </IconButton>

            {/* Language */}
            <IconButton 
              color="inherit" 
              onClick={handleLanguageMenuOpen}
              sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}
            >
              <Language />
            </IconButton>
            <Menu
              anchorEl={languageAnchorEl}
              open={Boolean(languageAnchorEl)}
              onClose={handleLanguageMenuClose}
              PaperProps={{
                sx: {
                  bgcolor: mode === 'dark' ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${mode === 'dark' ? 'rgba(0, 212, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                  minWidth: 150
                }
              }}
            >
              <MenuItem 
                onClick={() => {
                  setLanguage('EN');
                  handleLanguageMenuClose();
                }}
              >
                <ListItemText primary="English" />
                {language === 'EN' && (
                  <ListItemIcon>
                    <Check fontSize="small" color="primary" />
                  </ListItemIcon>
                )}
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Snackbar for copy feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Header;