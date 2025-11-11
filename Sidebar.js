import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ProcurementIcon,
  PointOfSale as SalesIcon,
  CreditCard as CreditSalesIcon,
  Inventory as StockIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Procurement', icon: <ProcurementIcon />, path: '/procurement' },
  { text: 'Sales', icon: <SalesIcon />, path: '/sales' },
  { text: 'Credit Sales', icon: <CreditSalesIcon />, path: '/credit-sales' },
  { text: 'Stock Management', icon: <StockIcon />, path: '/stock' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          GCDL System
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;