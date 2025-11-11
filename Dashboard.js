import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { analyticsAPI } from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [kpis, setKpis] = useState({
    totalSales: 0,
    totalProcurement: 0,
    profit: 0,
    lowStockItems: 0
  });
  const [salesTrends, setSalesTrends] = useState({});
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      const [kpisResponse, trendsResponse] = await Promise.all([
        analyticsAPI.getKPIs(),
        analyticsAPI.getSalesTrends(period)
      ]);
      
      setKpis(kpisResponse.data);
      setSalesTrends(trendsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const salesChartData = {
    labels: salesTrends.labels || [],
    datasets: [
      {
        label: 'Sales (UGX)',
        data: salesTrends.sales || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
    ],
  };

  const stockChartData = {
    labels: ['Beans', 'Maize', 'Cowpeas', 'Groundnuts', 'Rice', 'Soybeans'],
    datasets: [
      {
        label: 'Current Stock (Tons)',
        data: [12, 19, 8, 15, 12, 7],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <TextField
          select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </TextField>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Sales
              </Typography>
              <Typography variant="h4" component="div">
                UGX {kpis.totalSales?.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Procurement
              </Typography>
              <Typography variant="h4" component="div">
                UGX {kpis.totalProcurement?.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Profit
              </Typography>
              <Typography 
                variant="h4" 
                component="div"
                color={kpis.profit >= 0 ? 'success.main' : 'error.main'}
              >
                UGX {kpis.profit?.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Low Stock Alerts
              </Typography>
              <Typography 
                variant="h4" 
                component="div"
                color={kpis.lowStockItems > 0 ? 'error.main' : 'success.main'}
              >
                {kpis.lowStockItems}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sales Trends ({period})
            </Typography>
            <Line data={salesChartData} options={chartOptions} height={100} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Stock Distribution
            </Typography>
            <Doughnut data={stockChartData} options={chartOptions} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;