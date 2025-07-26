import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { PositionsList } from './index';
import { OrderHistory } from './index';

const Portfolio: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Portfolio
      </Typography>
      
      <Box>
        <PositionsList />
        <OrderHistory />
      </Box>
    </Container>
  );
};

export default Portfolio;