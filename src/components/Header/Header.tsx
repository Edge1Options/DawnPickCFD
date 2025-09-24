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
  const { connected, connecting, connect, disconnect, balance, address, accountId } = useWallet();
  const { mode, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  
  const [walletAnchorEl, setWalletAnchorEl] = useState<null | HTMLElement>(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  const [copySnackbar, setCopySnackbar] = useState({ open: false, message: '' });

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

  const formatBalance = (balance: number): string => {
    if (balance >= 1000000) {
      return `${(balance / 1000000).toFixed(2)}M ICP`;
    } else if (balance >= 1000) {
      return `${(balance / 1000).toFixed(2)}K ICP`;
    }
    return `${balance.toFixed(4)} ICP`;
  };

  const formatAddress = (address: string | null): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySnackbar({ open: true, message: `${label} copied to clipboard!` });
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleCopySnackbarClose = () => {
    setCopySnackbar({ open: false, message: '' });
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: mode === 'dark' 
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: mode === 'dark' 
            ? '1px solid rgba(200, 170, 110, 0.2)'
            : '1px solid rgba(30, 41, 59, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #C8AA6E 0%, #6366F1 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: mode === 'dark' ? '0 2px 8px rgba(200, 170, 110, 0.3)' : 'none',
              }}
            >
              DawnPickCFD
            </Typography>
            <Chip 
              label="Beta" 
              size="small" 
              sx={{ 
                ml: 2,
                background: 'linear-gradient(135deg, #C8AA6E 0%, #6366F1 100%)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.75rem',
              }} 
            />
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Wallet */}
            {connected ? (
              <>
                <Chip
                  label={formatBalance(balance)}
                  color="primary"
                  variant="outlined"
                  sx={{
                    background: mode === 'dark' 
                      ? 'linear-gradient(45deg, rgba(200, 170, 110, 0.1), rgba(99, 102, 241, 0.1))'
                      : 'linear-gradient(45deg, rgba(200, 170, 110, 0.05), rgba(99, 102, 241, 0.05))',
                    borderColor: '#C8AA6E',
                    color: mode === 'dark' ? '#C8AA6E' : '#6366F1',
                    fontWeight: 600,
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AccountBalanceWallet />}
                  onClick={handleWalletMenuOpen}
                  sx={{
                    borderColor: '#C8AA6E',
                    color: '#C8AA6E',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#6366F1',
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      color: '#6366F1',
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
                      bgcolor: mode === 'dark' 
                        ? 'rgba(30, 41, 59, 0.95)' 
                        : 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: mode === 'dark' 
                        ? '1px solid rgba(200, 170, 110, 0.2)' 
                        : '1px solid rgba(99, 102, 241, 0.2)',
                      borderRadius: 2,
                      minWidth: 320,
                      color: mode === 'dark' ? '#E2E8F0' : '#1E293B',
                      boxShadow: mode === 'dark' 
                        ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                        : '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                >
                  {/* Balance */}
                  <MenuItem disabled sx={{ opacity: 1 }}>
                    <ListItemIcon>
                      <AccountBalanceWallet fontSize="small" sx={{ color: '#C8AA6E' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Balance" 
                      secondary={formatBalance(balance)}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: mode === 'dark' ? '#E2E8F0' : '#1E293B',
                          fontWeight: 600,
                        },
                        '& .MuiListItemText-secondary': {
                          color: '#C8AA6E',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                        }
                      }}
                    />
                  </MenuItem>
                  
                  <Divider sx={{ borderColor: mode === 'dark' ? 'rgba(200, 170, 110, 0.2)' : 'rgba(99, 102, 241, 0.2)' }} />
                  
                  {/* Account ID */}
                  <MenuItem 
                    onClick={() => accountId && copyToClipboard(accountId, 'Account ID')}
                    sx={{ 
                      flexDirection: 'column', 
                      alignItems: 'flex-start',
                      py: 2,
                      '&:hover': {
                        backgroundColor: mode === 'dark' 
                          ? 'rgba(200, 170, 110, 0.1)' 
                          : 'rgba(99, 102, 241, 0.05)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <AccountBox fontSize="small" sx={{ color: '#6366F1' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Account ID" 
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: mode === 'dark' ? '#E2E8F0' : '#1E293B',
                            fontWeight: 600,
                          }
                        }}
                      />
                      <IconButton size="small" sx={{ color: '#94A3B8' }}>
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography 
                      variant="caption" 
                      sx={{
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal',
                        fontSize: '0.75rem',
                        color: mode === 'dark' ? 'rgba(226, 232, 240, 0.7)' : 'rgba(30, 41, 59, 0.6)',
                        pl: 4.5,
                        lineHeight: 1.3,
                        maxWidth: '280px'
                      }}
                    >
                      {accountId || 'Loading...'}
                    </Typography>
                  </MenuItem>
                  
                  <Divider sx={{ borderColor: mode === 'dark' ? 'rgba(200, 170, 110, 0.2)' : 'rgba(99, 102, 241, 0.2)' }} />
                  
                  {/* Principal ID */}
                  <MenuItem 
                    onClick={() => address && copyToClipboard(address, 'Principal ID')}
                    sx={{ 
                      flexDirection: 'column', 
                      alignItems: 'flex-start',
                      py: 2,
                      '&:hover': {
                        backgroundColor: mode === 'dark' 
                          ? 'rgba(200, 170, 110, 0.1)' 
                          : 'rgba(99, 102, 241, 0.05)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Fingerprint fontSize="small" sx={{ color: '#6366F1' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Principal ID" 
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: mode === 'dark' ? '#E2E8F0' : '#1E293B',
                            fontWeight: 600,
                          }
                        }}
                      />
                      <IconButton size="small" sx={{ color: '#94A3B8' }}>
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography 
                      variant="caption" 
                      sx={{
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal',
                        fontSize: '0.75rem',
                        color: mode === 'dark' ? 'rgba(226, 232, 240, 0.7)' : 'rgba(30, 41, 59, 0.6)',
                        pl: 4.5,
                        lineHeight: 1.3,
                        maxWidth: '280px'
                      }}
                    >
                      {address || 'Loading...'}
                    </Typography>
                  </MenuItem>
                  
                  <Divider sx={{ borderColor: mode === 'dark' ? 'rgba(200, 170, 110, 0.2)' : 'rgba(99, 102, 241, 0.2)' }} />
                  
                  {/* Disconnect */}
                  <MenuItem 
                    onClick={() => {
                      disconnect();
                      handleWalletMenuClose();
                    }}
                    sx={{
                      color: '#F59E0B',
                      '&:hover': {
                        backgroundColor: 'rgba(245, 158, 11, 0.1)'
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
                  background: 'linear-gradient(45deg, #C8AA6E, #6366F1)',
                  color: '#ffffff',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #D4B87A, #7C7FF5)',
                    boxShadow: '0 8px 25px rgba(200, 170, 110, 0.3)',
                  },
                  '&:disabled': {
                    background: 'rgba(200, 170, 110, 0.3)',
                    color: 'rgba(255, 255, 255, 0.7)'
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
              sx={{ 
                color: mode === 'dark' ? '#E2E8F0' : '#1E293B',
                '&:hover': {
                  backgroundColor: mode === 'dark' 
                    ? 'rgba(200, 170, 110, 0.1)' 
                    : 'rgba(99, 102, 241, 0.1)'
                }
              }}
            >
              <Settings />
            </IconButton>
            <Menu
              anchorEl={settingsAnchorEl}
              open={Boolean(settingsAnchorEl)}
              onClose={handleSettingsMenuClose}
              PaperProps={{
                sx: {
                  bgcolor: mode === 'dark' 
                    ? 'rgba(30, 41, 59, 0.95)' 
                    : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: mode === 'dark' 
                    ? '1px solid rgba(200, 170, 110, 0.2)' 
                    : '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: 2,
                  minWidth: 200,
                  color: mode === 'dark' ? '#E2E8F0' : '#1E293B'
                }
              }}
            >
              <MenuItem disabled>
                <ListItemText 
                  primary="Theme" 
                  sx={{ 
                    fontWeight: 'bold',
                    '& .MuiListItemText-primary': {
                      color: mode === 'dark' ? '#C8AA6E' : '#6366F1',
                      fontWeight: 600,
                    }
                  }} 
                />
              </MenuItem>
              <Divider sx={{ borderColor: mode === 'dark' ? 'rgba(200, 170, 110, 0.2)' : 'rgba(99, 102, 241, 0.2)' }} />
              <MenuItem 
                onClick={() => {
                  setTheme('light');
                  handleSettingsMenuClose();
                }}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: mode === 'dark' ? '#E2E8F0' : '#1E293B'
                  },
                  '&:hover': {
                    backgroundColor: mode === 'dark' 
                      ? 'rgba(200, 170, 110, 0.1)' 
                      : 'rgba(99, 102, 241, 0.05)'
                  }
                }}
              >
                <ListItemIcon>
                  <LightMode fontSize="small" sx={{ color: mode === 'dark' ? '#E2E8F0' : '#1E293B' }} />
                </ListItemIcon>
                <ListItemText primary="Light" />
                {mode === 'light' && (
                  <ListItemIcon>
                    <Check fontSize="small" sx={{ color: '#C8AA6E' }} />
                  </ListItemIcon>
                )}
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  setTheme('dark');
                  handleSettingsMenuClose();
                }}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: mode === 'dark' ? '#E2E8F0' : '#1E293B'
                  },
                  '&:hover': {
                    backgroundColor: mode === 'dark' 
                      ? 'rgba(200, 170, 110, 0.1)' 
                      : 'rgba(99, 102, 241, 0.05)'
                  }
                }}
              >
                <ListItemIcon>
                  <DarkMode fontSize="small" sx={{ color: mode === 'dark' ? '#E2E8F0' : '#1E293B' }} />
                </ListItemIcon>
                <ListItemText primary="Dark" />
                {mode === 'dark' && (
                  <ListItemIcon>
                    <Check fontSize="small" sx={{ color: '#C8AA6E' }} />
                  </ListItemIcon>
                )}
              </MenuItem>
            </Menu>

            {/* Notifications */}
            <IconButton 
              color="inherit"
              sx={{ 
                color: mode === 'dark' ? '#E2E8F0' : '#1E293B',
                '&:hover': {
                  backgroundColor: mode === 'dark' 
                    ? 'rgba(200, 170, 110, 0.1)' 
                    : 'rgba(99, 102, 241, 0.1)'
                }
              }}
            >
              <Notifications />
            </IconButton>

            {/* Language */}
            <IconButton 
              color="inherit" 
              onClick={handleLanguageMenuOpen}
              sx={{ 
                color: mode === 'dark' ? '#E2E8F0' : '#1E293B',
                '&:hover': {
                  backgroundColor: mode === 'dark' 
                    ? 'rgba(200, 170, 110, 0.1)' 
                    : 'rgba(99, 102, 241, 0.1)'
                }
              }}
            >
              <Language />
            </IconButton>
            <Menu
              anchorEl={languageAnchorEl}
              open={Boolean(languageAnchorEl)}
              onClose={handleLanguageMenuClose}
              PaperProps={{
                sx: {
                  bgcolor: mode === 'dark' 
                    ? 'rgba(30, 41, 59, 0.95)' 
                    : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: mode === 'dark' 
                    ? '1px solid rgba(200, 170, 110, 0.2)' 
                    : '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: 2,
                  minWidth: 150,
                  color: mode === 'dark' ? '#E2E8F0' : '#1E293B'
                }
              }}
            >
              <MenuItem 
                onClick={() => {
                  setLanguage('EN');
                  handleLanguageMenuClose();
                }}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: mode === 'dark' ? '#E2E8F0' : '#1E293B'
                  },
                  '&:hover': {
                    backgroundColor: mode === 'dark' 
                      ? 'rgba(200, 170, 110, 0.1)' 
                      : 'rgba(99, 102, 241, 0.05)'
                  }
                }}
              >
                <ListItemText primary="English" />
                {language === 'EN' && (
                  <ListItemIcon>
                    <Check fontSize="small" sx={{ color: '#C8AA6E' }} />
                  </ListItemIcon>
                )}
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  setLanguage('CN');
                  handleLanguageMenuClose();
                }}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: mode === 'dark' ? '#E2E8F0' : '#1E293B'
                  },
                  '&:hover': {
                    backgroundColor: mode === 'dark' 
                      ? 'rgba(200, 170, 110, 0.1)' 
                      : 'rgba(99, 102, 241, 0.05)'
                  }
                }}
              >
                <ListItemText primary="中文" />
                {language === 'CN' && (
                  <ListItemIcon>
                    <Check fontSize="small" sx={{ color: '#C8AA6E' }} />
                  </ListItemIcon>
                )}
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Copy Snackbar */}
      <Snackbar
        open={copySnackbar.open}
        autoHideDuration={3000}
        onClose={handleCopySnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCopySnackbarClose} 
          severity="success" 
          sx={{ 
            width: '100%',
            background: 'linear-gradient(135deg, #C8AA6E 0%, #6366F1 100%)',
            color: '#FFFFFF',
            '& .MuiAlert-icon': {
              color: '#FFFFFF'
            }
          }}
        >
          {copySnackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Header;