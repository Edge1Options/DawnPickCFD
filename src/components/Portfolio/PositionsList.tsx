import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import { useTradingState } from '../../hooks/useTradingState';

const PositionsList: React.FC = () => {
  const { positions } = useTradingState();

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Open Positions ({positions.length})
        </Typography>
        
        {positions.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={4}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Open Positions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your active positions will appear here
            </Typography>
          </Box>
        ) : (
          <Box>
            {/* Position list implementation */}
            <Typography>Positions will be displayed here</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PositionsList;