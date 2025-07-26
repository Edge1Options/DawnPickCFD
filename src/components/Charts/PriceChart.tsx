import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  useTheme
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { useMarketData } from '@/hooks/useMarketData';

interface PriceChartProps {
  selectedSymbol?: string;
  height?: number;
}

interface PricePoint {
  timestamp: number;
  price: number;
  volume: number;
  time: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ selectedSymbol, height = 400 }) => {
  const { selectedContract } = useMarketData();
  const [timeframe, setTimeframe] = useState('1H');
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const theme = useTheme();
  
  // Define lineColor variable
  const lineColor = selectedContract && priceData.length > 1 
    ? (priceData[priceData.length - 1].price > priceData[0].price ? '#4caf50' : '#f44336')
    : '#00d4ff';

  const contract = selectedContract;
  
  // Generate mock price data
  const generatePriceData = (timeframe: string, currentPrice: number) => {
    const now = Date.now();
    const intervals = {
      '5M': { count: 288, interval: 5 * 60 * 1000 }, // 5 minutes
      '15M': { count: 96, interval: 15 * 60 * 1000 }, // 15 minutes
      '1H': { count: 24, interval: 60 * 60 * 1000 }, // 1 hour
      '4H': { count: 24, interval: 4 * 60 * 60 * 1000 }, // 4 hours
      '1D': { count: 30, interval: 24 * 60 * 60 * 1000 }, // 1 day
    };

    const { count, interval } = intervals[timeframe as keyof typeof intervals] || intervals['1H'];
    const data: PricePoint[] = [];
    
    let price = currentPrice * (0.95 + Math.random() * 0.1); // Start with some variation
    
    for (let i = count; i >= 0; i--) {
      const timestamp = now - (i * interval);
      
      // Simulate price movement
      const change = (Math.random() - 0.5) * 0.02; // ±1% change
      price = price * (1 + change);
      
      // Trend towards current price as we get closer to now
      if (i < count * 0.3) {
        const trendFactor = (count * 0.3 - i) / (count * 0.3);
        price = price * (1 - trendFactor * 0.1) + currentPrice * trendFactor * 0.1;
      }
      
      data.push({
        timestamp,
        price: Math.max(price, 0.01), // Ensure positive price
        volume: Math.floor(Math.random() * 1000000) + 100000,
        time: new Date(timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      });
    }
    
    // Ensure the last price matches current price
    if (data.length > 0) {
      data[data.length - 1].price = currentPrice;
    }
    
    return data;
  };

  useEffect(() => {
    if (contract) {
      const data = generatePriceData(timeframe, contract.price);
      setPriceData(data);
    }
  }, [contract, timeframe]);

  const handleTimeframeChange = (event: React.MouseEvent<HTMLElement>, newTimeframe: string | null) => {
    if (newTimeframe !== null) {
      setTimeframe(newTimeframe);
    }
  };

  const priceChange = useMemo(() => {
    if (priceData.length < 2) return { amount: 0, percentage: 0 };
    
    const firstPrice = priceData[0].price;
    const lastPrice = priceData[priceData.length - 1].price;
    const amount = lastPrice - firstPrice;
    const percentage = (amount / firstPrice) * 100;
    
    return { amount, percentage };
  }, [priceData]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(value);
  };

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'price') {
      return [formatPrice(value), 'Price'];
    }
    return [value, name];
  };

  const formatTooltipLabel = (label: string, payload: any[]) => {
    if (payload && payload.length > 0) {
      const timestamp = payload[0].payload.timestamp;
      return new Date(timestamp).toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return label;
  };

  if (!contract) {
    return (
      <Card sx={{ height }}>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography variant="h6" color="text.secondary">
              Select a contract to view chart
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {contract.symbol} - {contract.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h4" fontWeight="bold">
                {formatPrice(contract.price)}
              </Typography>
              <Chip
                size="small"
                label={`${priceChange.amount >= 0 ? '+' : ''}${formatPrice(priceChange.amount)} (${priceChange.percentage.toFixed(2)}%)`}
                color={priceChange.amount >= 0 ? 'success' : 'error'}
              />
            </Box>
          </Box>
          
          <ToggleButtonGroup
            value={timeframe}
            exclusive
            onChange={handleTimeframeChange}
            size="small"
          >
            <ToggleButton value="5M">5M</ToggleButton>
            <ToggleButton value="15M">15M</ToggleButton>
            <ToggleButton value="1H">1H</ToggleButton>
            <ToggleButton value="4H">4H</ToggleButton>
            <ToggleButton value="1D">1D</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        {/* Chart */}
        <Box flex={1}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis 
                dataKey="time"
                stroke={theme.palette.text.secondary}
                fontSize={12}
              />
              <YAxis 
                domain={['dataMin - 0.1', 'dataMax + 0.1']}
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip
                formatter={formatTooltipValue}
                labelFormatter={formatTooltipLabel}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={lineColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: lineColor, strokeWidth: 2 }}
              />
              {priceData.length > 0 && (
                <ReferenceLine
                  y={priceData[0].price}
                  stroke={theme.palette.text.disabled}
                  strokeDasharray="5 5"
                  label={{ value: "Start", position: "left" }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PriceChart;