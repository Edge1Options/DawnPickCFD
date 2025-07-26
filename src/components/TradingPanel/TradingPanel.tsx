import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Chip,
  Grid,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Calculate,
  Warning,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useMarketData } from '@/hooks/useMarketData';
import { useWallet } from '@/hooks/useWallet';
import { useTradingState } from '@/hooks/useTradingState';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(0, 212, 255, 0.05)',
  border: '1px solid rgba(0, 212, 255, 0.2)',
  borderRadius: '12px',
  marginBottom: theme.spacing(2),
}));

const TradeButton = styled(Button)<{ side: 'long' | 'short' }>(({ theme, side }) => ({
  backgroundColor: side === 'long' ? '#4caf50' : '#f44336',
  color: '#ffffff',
  fontWeight: 'bold',
  padding: theme.spacing(1.5),
  '&:hover': {
    backgroundColor: side === 'long' ? '#388e3c' : '#d32f2f',
  },
  '&:disabled': {
    backgroundColor: 'rgba(158, 158, 158, 0.3)',
    color: 'rgba(255, 255, 255, 0.5)',
  },
}));

// 添加props接口
interface TradingPanelProps {
  selectedSymbol?: string;
}

const TradingPanel: React.FC<TradingPanelProps> = ({ selectedSymbol }) => {
  const { selectedContract } = useMarketData();
  const { connected, balance } = useWallet();
  const { placeOrder } = useTradingState();
  
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [quantity, setQuantity] = useState<string>('100');
  const [leverage, setLeverage] = useState<number>(1);
  const [limitPrice, setLimitPrice] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [useStopLoss, setUseStopLoss] = useState(false);
  const [useTakeProfit, setUseTakeProfit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateMargin = () => {
    if (!selectedContract || !quantity) return 0;
    const qty = parseFloat(quantity);
    const price = orderType === 'limit' && limitPrice ? parseFloat(limitPrice) : selectedContract.price;
    return (qty * price) / leverage;
  };

  const calculatePotentialPnL = (priceChange: number) => {
    if (!selectedContract || !quantity) return 0;
    const qty = parseFloat(quantity);
    const price = orderType === 'limit' && limitPrice ? parseFloat(limitPrice) : selectedContract.price;
    const newPrice = price * (1 + priceChange / 100);
    const pnl = (newPrice - price) * qty * (side === 'long' ? 1 : -1) * leverage;
    return pnl;
  };

  const handleSubmitOrder = async () => {
    if (!selectedContract || !connected) return;
    
    setIsSubmitting(true);
    try {
      const order = {
        contractId: selectedContract.id,
        symbol: selectedContract.symbol,
        side,
        type: orderType,
        quantity: parseFloat(quantity),
        price: orderType === 'limit' ? parseFloat(limitPrice) : undefined,
        leverage,
        stopLoss: useStopLoss && stopLoss ? parseFloat(stopLoss) : undefined,
        takeProfit: useTakeProfit && takeProfit ? parseFloat(takeProfit) : undefined,
      };
      
      await placeOrder(order);
      
      // Reset form
      setQuantity('100');
      setLimitPrice('');
      setStopLoss('');
      setTakeProfit('');
      setUseStopLoss(false);
      setUseTakeProfit(false);
    } catch (error) {
      console.error('Failed to place order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    if (!selectedContract || !connected || !quantity) return false;
    if (orderType === 'limit' && !limitPrice) return false;
    if (parseFloat(quantity) <= 0) return false;
    if (calculateMargin() > balance) return false;
    return true;
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  if (!selectedContract) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" sx={{ color: '#b0b8d4', mb: 2 }}>
          Select a Contract
        </Typography>
        <Typography variant="body2" sx={{ color: '#b0b8d4' }}>
          Choose a contract from the list to start trading
        </Typography>
      </Box>
    );
  }

  if (!connected) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" sx={{ color: '#b0b8d4', mb: 2 }}>
          Connect Wallet
        </Typography>
        <Typography variant="body2" sx={{ color: '#b0b8d4' }}>
          Please connect your wallet to start trading
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Selected Contract Info */}
      <StyledCard>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              {selectedContract.symbol}
            </Typography>
            <Chip
              size="small"
              label={selectedContract.type.toUpperCase()}
              sx={{
                backgroundColor: selectedContract.type === 'stock' ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255, 107, 53, 0.2)',
                color: selectedContract.type === 'stock' ? '#00d4ff' : '#ff6b35',
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#b0b8d4', mb: 2 }}>
            {selectedContract.name}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              ${formatNumber(selectedContract.price)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {selectedContract.change > 0 ? (
                <TrendingUp sx={{ color: '#4caf50', mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ color: '#f44336', mr: 0.5 }} />
              )}
              <Typography
                variant="body1"
                sx={{
                  color: selectedContract.change > 0 ? '#4caf50' : '#f44336',
                  fontWeight: 'bold',
                }}
              >
                {selectedContract.change >= 0 ? '+' : ''}{formatNumber(selectedContract.changePercent)}%
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </StyledCard>

      {/* Order Type Selection */}
      <StyledCard>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#00d4ff', mb: 2, fontWeight: 'bold' }}>
            Order Type
          </Typography>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant={orderType === 'market' ? 'contained' : 'outlined'}
                onClick={() => setOrderType('market')}
                sx={{
                  borderColor: '#00d4ff',
                  color: orderType === 'market' ? '#ffffff' : '#00d4ff',
                  backgroundColor: orderType === 'market' ? '#00d4ff' : 'transparent',
                }}
              >
                Market
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant={orderType === 'limit' ? 'contained' : 'outlined'}
                onClick={() => setOrderType('limit')}
                sx={{
                  borderColor: '#00d4ff',
                  color: orderType === 'limit' ? '#ffffff' : '#00d4ff',
                  backgroundColor: orderType === 'limit' ? '#00d4ff' : 'transparent',
                }}
              >
                Limit
              </Button>
            </Grid>
          </Grid>

          {/* Limit Price */}
          {orderType === 'limit' && (
            <TextField
              fullWidth
              label="Limit Price"
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <Typography sx={{ color: '#b0b8d4', mr: 1 }}>$</Typography>,
              }}
            />
          )}

          {/* Quantity */}
          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <Typography sx={{ color: '#b0b8d4', mr: 1 }}>$</Typography>,
            }}
          />

          {/* Leverage */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#b0b8d4', mb: 1 }}>
              Leverage: {leverage}x
            </Typography>
            <Slider
              value={leverage}
              onChange={(_, value) => setLeverage(value as number)}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
              sx={{
                color: '#00d4ff',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#00d4ff',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#00d4ff',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: 'rgba(0, 212, 255, 0.3)',
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 2, borderColor: 'rgba(0, 212, 255, 0.2)' }} />

          {/* Stop Loss & Take Profit */}
          <FormControlLabel
            control={
              <Switch
                checked={useStopLoss}
                onChange={(e) => setUseStopLoss(e.target.checked)}
                sx={{ color: '#00d4ff' }}
              />
            }
            label="Stop Loss"
            sx={{ color: '#b0b8d4', mb: 1 }}
          />
          {useStopLoss && (
            <TextField
              fullWidth
              label="Stop Loss Price"
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <Typography sx={{ color: '#b0b8d4', mr: 1 }}>$</Typography>,
              }}
            />
          )}

          <FormControlLabel
            control={
              <Switch
                checked={useTakeProfit}
                onChange={(e) => setUseTakeProfit(e.target.checked)}
                sx={{ color: '#00d4ff' }}
              />
            }
            label="Take Profit"
            sx={{ color: '#b0b8d4', mb: 1 }}
          />
          {useTakeProfit && (
            <TextField
              fullWidth
              label="Take Profit Price"
              type="number"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <Typography sx={{ color: '#b0b8d4', mr: 1 }}>$</Typography>,
              }}
            />
          )}
        </CardContent>
      </StyledCard>

      {/* Order Summary */}
      <StyledCard>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#00d4ff', mb: 2, fontWeight: 'bold' }}>
            <Calculate sx={{ mr: 1, verticalAlign: 'middle' }} />
            Order Summary
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#b0b8d4' }}>Required Margin:</Typography>
            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              ${formatNumber(calculateMargin())}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#b0b8d4' }}>Available Balance:</Typography>
            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              ${formatNumber(balance)}
            </Typography>
          </Box>

          <Divider sx={{ my: 2, borderColor: 'rgba(0, 212, 255, 0.2)' }} />

          <Typography variant="body2" sx={{ color: '#b0b8d4', mb: 1 }}>Potential P&L:</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#4caf50' }}>+5%: ${formatNumber(calculatePotentialPnL(5))}</Typography>
            <Typography variant="body2" sx={{ color: '#f44336' }}>-5%: ${formatNumber(calculatePotentialPnL(-5))}</Typography>
          </Box>

          {calculateMargin() > balance && (
            <Alert severity="warning" sx={{ mt: 2, backgroundColor: 'rgba(255, 107, 53, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Warning sx={{ mr: 1 }} />
                Insufficient balance for this trade
              </Box>
            </Alert>
          )}
        </CardContent>
      </StyledCard>

      {/* Trade Buttons */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TradeButton
            fullWidth
            side="long"
            onClick={() => {
              setSide('long');
              handleSubmitOrder();
            }}
            disabled={!isFormValid() || isSubmitting}
            startIcon={<TrendingUp />}
          >
            {isSubmitting && side === 'long' ? 'Placing...' : 'Buy / Long'}
          </TradeButton>
        </Grid>
        <Grid item xs={6}>
          <TradeButton
            fullWidth
            side="short"
            onClick={() => {
              setSide('short');
              handleSubmitOrder();
            }}
            disabled={!isFormValid() || isSubmitting}
            startIcon={<TrendingDown />}
          >
            {isSubmitting && side === 'short' ? 'Placing...' : 'Sell / Short'}
          </TradeButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TradingPanel;