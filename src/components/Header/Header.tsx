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
  Avatar
} from '@mui/material';
import {
  AccountBalanceWallet,
  Settings,
  Notifications,
  Language
} from '@mui/icons-material';
import { useWallet } from '../../hooks/useWallet';

const Header: React.FC = () => {
  const { connected, address, balance, connect, disconnect } = useWallet();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
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
              />
              <Button
                variant="outlined"
                startIcon={<AccountBalanceWallet />}
                onClick={handleMenuOpen}
              >
                {formatAddress(address)}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={disconnect}>Disconnect</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              startIcon={<AccountBalanceWallet />}
              onClick={connect}
            >
              Connect Wallet
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