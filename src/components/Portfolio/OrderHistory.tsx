import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Cancel,
  CheckCircle,
  Schedule,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { useTradingState } from '../../hooks/useTradingState';
import { Order } from '../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const OrderHistory: React.FC = () => {
  const theme = useTheme();
  const { orders, cancelOrder } = useTradingState();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Schedule color="warning" />;
      case 'filled':
        return <CheckCircle color="success" />;
      case 'cancelled':
        return <Cancel color="error" />;
      default:
        return <Schedule />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'filled':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const completedOrders = orders.filter(order => order.status !== 'pending');

  const renderOrderTable = (orderList: Order[], showActions = false) => {
    if (orderList.length === 0) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={4}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {showActions ? 'No pending orders' : 'No order history'}
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell>Status</TableCell>
              {showActions && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {orderList.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography variant="body2">
                    {formatDateTime(order.timestamp)}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" fontWeight="bold">
                      {order.symbol}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${order.leverage}x`}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Chip
                    size="small"
                    label={`${order.side.toUpperCase()} ${order.type.toUpperCase()}`}
                    color={order.side === 'long' ? 'success' : 'error'} // 修改为'long'和'short'
                    icon={order.side === 'long' ? <TrendingUp /> : <TrendingDown />} // 修改为'long'和'short'
                  />
                </TableCell>
                
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatCurrency(order.quantity)} {/* 修改为quantity而不是size */}
                  </Typography>
                </TableCell>
                
                <TableCell align="right">
                  <Typography variant="body2">
                    {order.type === 'market' ? 'Market' : formatCurrency(order.price || 0)} {/* 添加默认值处理undefined */}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getStatusIcon(order.status)}
                    <Chip
                      size="small"
                      label={order.status.toUpperCase()}
                      color={getStatusColor(order.status) as any}
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
                
                {showActions && (
                  <TableCell align="center">
                    {order.status === 'pending' && (
                      <Tooltip title="Cancel Order">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => cancelOrder(order.id)}
                        >
                          <Cancel fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Orders
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`Pending (${pendingOrders.length})`} />
            <Tab label={`History (${completedOrders.length})`} />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Box mt={2}>
            {renderOrderTable(pendingOrders, true)}
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box mt={2}>
            {renderOrderTable(completedOrders, false)}
          </Box>
        </TabPanel>
      </CardContent>
    </Card>
  );
};

export default OrderHistory;