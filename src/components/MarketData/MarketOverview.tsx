import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  ShowChart,
  AccountBalance,
  Speed,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useMarketData } from '@/hooks/useMarketData';
import { CFDContract } from '@/types';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(0, 212, 255, 0.05)',
  border: '1px solid rgba(0, 212, 255, 0.2)',
  borderRadius: '8px',
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    transform: 'translateY(-2px)',
  },
}));

const MetricValue = styled(Typography)(({ theme }) => ({
  fontSize: '1.8rem',
  fontWeight: 'bold',
  color: '#ffffff',
}));

const MetricLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: '#b0b8d4',
  marginBottom: theme.spacing(1),
}));

const ChangeChip = styled(Chip)<{ changeType: 'positive' | 'negative' | 'neutral' }>(({ theme, changeType }) => ({
  backgroundColor:
    changeType === 'positive'
      ? 'rgba(76, 175, 80, 0.2)'
      : changeType === 'negative'
      ? 'rgba(244, 67, 54, 0.2)'
      : 'rgba(158, 158, 158, 0.2)',
  color:
    changeType === 'positive'
      ? '#4caf50'
      : changeType === 'negative'
      ? '#f44336'
      : '#9e9e9e',
  border: `1px solid ${
    changeType === 'positive'
      ? '#4caf50'
      : changeType === 'negative'
      ? '#f44336'
      : '#9e9e9e'
  }`,
  fontWeight: 'bold',
}));

const MarketOverview: React.FC = () => {
  const { marketData, isLoading } = useMarketData();

  if (isLoading || !marketData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: '#00d4ff' }} />
      </Box>
    );
  }

  // 统一的市场统计数据计算
  const calculateMarketStats = () => {
    const totalContracts = marketData.contracts.length;
    const gainers = marketData.contracts.filter((c: CFDContract) => c.change > 0).length;
    const losers = marketData.contracts.filter((c: CFDContract) => c.change < 0).length;
    const unchanged = totalContracts - gainers - losers;

    const avgChange = marketData.contracts.reduce((sum: number, c: CFDContract) => sum + c.changePercent, 0) / totalContracts;
    const totalVolume = marketData.contracts.reduce((sum: number, c: CFDContract) => sum + (c.price * 1000000), 0);

    const stocks = marketData.contracts.filter((c: CFDContract) => c.type === 'stock');
    const indices = marketData.contracts.filter((c: CFDContract) => c.type === 'index');

    return {
      totalContracts,
      gainers,
      losers,
      unchanged,
      avgChange,
      totalVolume,
      stocks,
      indices,
    };
  };

  const stats = calculateMarketStats();

  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(1)}K`;
    return `$${volume.toFixed(0)}`;
  };

  const getChangeType = (change: number): 'positive' | 'negative' | 'neutral' => {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp />;
    if (change < 0) return <TrendingDown />;
    return <TrendingFlat />;
  };

  return (
    <Grid container spacing={2}>
      {/* Market Summary */}
      <Grid item xs={12} sm={6} md={3}>
        <StyledCard>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ShowChart sx={{ color: '#00d4ff', mr: 1 }} />
              <MetricLabel>Market Trend</MetricLabel>
            </Box>
            <MetricValue>
              {stats.avgChange >= 0 ? '+' : ''}{formatNumber(stats.avgChange)}%
            </MetricValue>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {getTrendIcon(stats.avgChange)}
              <ChangeChip
                size="small"
                label={stats.avgChange >= 0 ? 'Bullish' : 'Bearish'}
                changeType={getChangeType(stats.avgChange)}
                sx={{ ml: 1 }}
              />
            </Box>
          </CardContent>
        </StyledCard>
      </Grid>

      {/* Active Contracts */}
      <Grid item xs={12} sm={6} md={3}>
        <StyledCard>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccountBalance sx={{ color: '#00d4ff', mr: 1 }} />
              <MetricLabel>Active Contracts</MetricLabel>
            </Box>
            <MetricValue>{stats.totalContracts}</MetricValue>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ color: '#b0b8d4' }}>
                {stats.stocks.length} Stocks • {stats.indices.length} Indices
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>
      </Grid>

      {/* Market Sentiment */}
      <Grid item xs={12} sm={6} md={3}>
        <StyledCard>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Speed sx={{ color: '#00d4ff', mr: 1 }} />
              <MetricLabel>Market Sentiment</MetricLabel>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <ChangeChip
                size="small"
                label={`${stats.gainers} Up`}
                changeType="positive"
              />
              <ChangeChip
                size="small"
                label={`${stats.losers} Down`}
                changeType="negative"
              />
              <ChangeChip
                size="small"
                label={`${stats.unchanged} Flat`}
                changeType="neutral"
              />
            </Box>
          </CardContent>
        </StyledCard>
      </Grid>

      {/* Trading Volume */}
      <Grid item xs={12} sm={6} md={3}>
        <StyledCard>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ShowChart sx={{ color: '#00d4ff', mr: 1 }} />
              <MetricLabel>24h Volume</MetricLabel>
            </Box>
            <MetricValue>{formatVolume(stats.totalVolume)}</MetricValue>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ color: '#4caf50' }}>
                +12.5% from yesterday
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>
      </Grid>

      {/* Top Movers */}
      <Grid item xs={12}>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ color: '#00d4ff', mb: 2, fontWeight: 'bold' }}>
            Top Movers
          </Typography>
          <Grid container spacing={2}>
            {marketData.contracts
              .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
              .slice(0, 4)
              .map((contract) => (
                <Grid item xs={12} sm={6} md={3} key={contract.id}>
                  <StyledCard>
                    <CardContent sx={{ py: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                            {contract.symbol}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#b0b8d4' }}>
                            ${formatNumber(contract.price)}
                          </Typography>
                        </Box>
                        <ChangeChip
                          size="small"
                          label={`${contract.changePercent >= 0 ? '+' : ''}${formatNumber(contract.changePercent)}%`}
                          changeType={getChangeType(contract.changePercent)}
                        />
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MarketOverview;