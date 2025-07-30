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
  CircularProgress
} from '@mui/material';
import {
  AccountBalanceWallet,
  Settings,
  Notifications,
  Language
} from '@mui/icons-material';
import { useWallet } from '../../hooks/useWallet';

const Header: React.FC = () => {
  const { connected, address, balance, connecting, connect, disconnect } = useWallet();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: 'rgba(18, 18, 18, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Toolbar sx={{ minHeight: 70 }}>
        {/* Logo with gradient */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
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
            DawnPick CFD
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
                onClick={handleMenuOpen}
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
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    bgcolor: 'rgba(18, 18, 18, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 212, 255, 0.2)'
                  }
                }}
              >
                <MenuItem 
                  onClick={() => {
                    disconnect();
                    handleMenuClose();
                  }}
                  sx={{ color: '#ff6b35' }}
                >
                  Disconnect
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
          <IconButton color="inherit">
            <Settings />
          </IconButton>

          {/* Notifications */}
          <IconButton color="inherit">
            <Notifications />
          </IconButton>

          {/* Language */}
          <IconButton color="inherit">
            <Language />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;