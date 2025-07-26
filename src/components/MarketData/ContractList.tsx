import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Button,
  Chip,
  styled
} from '@mui/material';
import {
  Search,
  Star,
  StarBorder,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { useMarketData } from '@/hooks/useMarketData';
import { CFDContract } from '@/types';

interface ContractListProps {
  onSymbolSelect?: (symbol: string) => void;
}

const PriceCell = styled(TableCell)<{ trend: 'up' | 'down' | 'neutral' }>(({ theme, trend }) => ({
  color: trend === 'up' ? '#4caf50' : trend === 'down' ? '#f44336' : '#ffffff',
  fontWeight: 'bold',
}));

const ChangeChip = styled(Chip)<{ changeType: 'positive' | 'negative' | 'neutral' }>(({ changeType }) => ({
  backgroundColor: changeType === 'positive' ? 'rgba(76, 175, 80, 0.2)' : 
                   changeType === 'negative' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(255, 255, 255, 0.1)',
  color: changeType === 'positive' ? '#4caf50' : 
         changeType === 'negative' ? '#f44336' : '#ffffff',
  fontWeight: 'bold',
}));

const ContractList: React.FC<ContractListProps> = ({ onSymbolSelect }) => {
  const { marketData, selectedContract, selectContract } = useMarketData();
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleFavorite = (contractId: string) => {
    setFavorites(prev => 
      prev.includes(contractId)
        ? prev.filter(id => id !== contractId)
        : [...prev, contractId]
    );
  };

  const getFilteredContracts = () => {
    if (!marketData) return [];
    
    let contracts = marketData.contracts;
    
    // Filter by tab
    if (tabValue === 1) {
      contracts = contracts.filter((c: CFDContract) => c.type === 'stock');
    } else if (tabValue === 2) {
      contracts = contracts.filter((c: CFDContract) => c.type === 'index');
    } else if (tabValue === 3) {
      contracts = contracts.filter((c: CFDContract) => favorites.includes(c.id));
    }
    
    // Filter by search term
    if (searchTerm) {
      contracts = contracts.filter((c: CFDContract) => 
        c.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return contracts;
  };

  const filteredContracts = getFilteredContracts();

  const handleRowClick = (contract: CFDContract) => {
    selectContract(contract);
    if (onSymbolSelect) {
      onSymbolSelect(contract.symbol);
    }
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const getChangeType = (change: number): 'positive' | 'negative' | 'neutral' => {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  };

  const getTrend = (change: number): 'up' | 'down' | 'neutral' => {
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
  };

  return (
    <Box>
      {/* Search and Tabs */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search contracts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#b0b8d4' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(0, 212, 255, 0.05)',
              '& fieldset': {
                borderColor: 'rgba(0, 212, 255, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0, 212, 255, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00d4ff',
              },
            },
            '& .MuiInputBase-input': {
              color: '#ffffff',
            },
          }}
        />
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: '#b0b8d4',
              '&.Mui-selected': {
                color: '#00d4ff',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#00d4ff',
            },
          }}
        >
          <Tab label="All" />
          <Tab label="Stocks" />
          <Tab label="Indices" />
          <Tab label="Favorites" />
        </Tabs>
      </Box>

      {/* Contract Table */}
      <TableContainer sx={{ 
        backgroundColor: 'rgba(0, 212, 255, 0.05)',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        borderRadius: '8px'
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Change</TableCell>
              <TableCell align="right">Change %</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContracts.map((contract: CFDContract) => (
              <TableRow
                key={contract.id}
                onClick={() => handleRowClick(contract)}
                sx={{
                  backgroundColor: selectedContract?.id === contract.id ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 212, 255, 0.05)',
                  },
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(contract.id);
                      }}
                      sx={{ mr: 1, color: favorites.includes(contract.id) ? '#ffc107' : '#b0b8d4' }}
                    >
                      {favorites.includes(contract.id) ? <Star /> : <StarBorder />}
                    </IconButton>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {contract.symbol}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#b0b8d4' }}>
                    {contract.name}
                  </Typography>
                </TableCell>
                <PriceCell align="right" trend={getTrend(contract.change)}>
                  ${formatNumber(contract.price)}
                </PriceCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {contract.change > 0 ? (
                      <TrendingUp sx={{ color: '#4caf50', mr: 0.5, fontSize: '1rem' }} />
                    ) : contract.change < 0 ? (
                      <TrendingDown sx={{ color: '#f44336', mr: 0.5, fontSize: '1rem' }} />
                    ) : null}
                    <Typography
                      variant="body2"
                      sx={{
                        color: contract.change > 0 ? '#4caf50' : contract.change < 0 ? '#f44336' : '#ffffff',
                        fontWeight: 'bold',
                      }}
                    >
                      {contract.change >= 0 ? '+' : ''}{formatNumber(contract.change)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <ChangeChip
                    size="small"
                    label={`${contract.changePercent >= 0 ? '+' : ''}${formatNumber(contract.changePercent)}%`}
                    changeType={getChangeType(contract.changePercent)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    size="small"
                    label={contract.type.toUpperCase()}
                    sx={{
                      backgroundColor: contract.type === 'stock' ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255, 107, 53, 0.2)',
                      color: contract.type === 'stock' ? '#00d4ff' : '#ff6b35',
                      fontWeight: 'bold',
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectContract(contract);
                    }}
                    sx={{
                      borderColor: '#00d4ff',
                      color: '#00d4ff',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                      },
                    }}
                  >
                    Trade
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredContracts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" sx={{ color: '#b0b8d4' }}>
            No contracts found matching your criteria.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ContractList;