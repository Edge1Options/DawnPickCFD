import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Container,
  Fade,
  Grow
} from '@mui/material';
import { MarketOverview, ContractList } from '../MarketData';
import { PositionsList, OrderHistory } from '../Portfolio';
import { PriceChart } from '../Charts';
import TradingPanel from './TradingPanel'; // Change back to direct import

const TradingDashboard: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');

  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Market Overview Card */}
      <Grow in timeout={500}>
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <MarketOverview />
          </CardContent>
        </Card>
      </Grow>

      <Grid container spacing={3}>
        {/* Contract List Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Fade in timeout={700}>
            <Card sx={{ height: 600, borderRadius: 2 }}>
              <CardHeader title="Market Contracts" />
              <CardContent sx={{ height: 'calc(100% - 80px)', overflow: 'auto' }}>
                <ContractList onSymbolSelect={handleSymbolSelect} />
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Price Chart Card */}
        <Grid item xs={12} md={6} lg={5}>
          <Fade in timeout={900}>
            <Card sx={{ height: 600, borderRadius: 2 }}>
              <CardHeader title="Price Chart" />
              <CardContent sx={{ height: 'calc(100% - 80px)' }}>
                <PriceChart selectedSymbol={selectedSymbol} height={500} />
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Trading Panel Card */}
        <Grid item xs={12} lg={3}>
          <Fade in timeout={1100}>
            <Card sx={{ height: 600, borderRadius: 2 }}>
              <CardHeader title="Trading Panel" />
              <CardContent sx={{ height: 'calc(100% - 80px)', overflow: 'auto' }}>
                <TradingPanel selectedSymbol={selectedSymbol} />
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>

      {/* Portfolio Section */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Fade in timeout={1300}>
            <Card sx={{ borderRadius: 2 }}>
              <CardHeader title="Position Management" />
              <CardContent>
                <PositionsList />
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Fade in timeout={1500}>
            <Card sx={{ borderRadius: 2 }}>
              <CardHeader title="Trading History" />
              <CardContent>
                <OrderHistory />
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TradingDashboard;