import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { procurementAPI } from '../../services/api';

const produceTypes = [
  'Beans',
  'Grain Maize',
  'Cowpeas',
  'Groundnuts',
  'Rice',
  'Soybeans'
];

const branches = ['Kampala', 'Wakiso'];

const ProcurementForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    produceName: '',
    produceType: '',
    date: new Date(),
    tonnage: '',
    cost: '',
    dealerName: '',
    branch: '',
    contact: '',
    sellingPrice: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.produceName) newErrors.produceName = 'Produce name is required';
    if (!formData.tonnage || formData.tonnage <= 0) newErrors.tonnage = 'Valid tonnage is required';
    if (!formData.cost || formData.cost <= 0) newErrors.cost = 'Valid cost is required';
    if (!formData.dealerName) newErrors.dealerName = 'Dealer name is required';
    if (!formData.contact || !/^\+?[\d\s-]{10,}$/.test(formData.contact)) {
      newErrors.contact = 'Valid phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      await procurementAPI.create({
        ...formData,
        date: formData.date.toISOString()
      });
      
      setMessage('Procurement recorded successfully!');
      setFormData({
        produceName: '',
        produceType: '',
        date: new Date(),
        tonnage: '',
        cost: '',
        dealerName: '',
        branch: '',
        contact: '',
        sellingPrice: ''
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      setMessage('Error recording procurement: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Record New Procurement
        </Typography>
        
        {message && (
          <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Produce Name"
                name="produceName"
                value={formData.produceName}
                onChange={handleChange}
                error={!!errors.produceName}
                helperText={errors.produceName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Produce Type"
                name="produceType"
                value={formData.produceType}
                onChange={handleChange}
              >
                {produceTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Procurement Date"
                value={formData.date}
                onChange={(newValue) => setFormData(prev => ({ ...prev, date: newValue }))}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Tonnage"
                name="tonnage"
                type="number"
                value={formData.tonnage}
                onChange={handleChange}
                error={!!errors.tonnage}
                helperText={errors.tonnage}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Cost (UGX)"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                error={!!errors.cost}
                helperText={errors.cost}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Dealer Name"
                name="dealerName"
                value={formData.dealerName}
                onChange={handleChange}
                error={!!errors.dealerName}
                helperText={errors.dealerName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
              >
                {branches.map(branch => (
                  <MenuItem key={branch} value={branch}>
                    {branch}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Dealer Contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                error={!!errors.contact}
                helperText={errors.contact}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Selling Price (UGX)"
                name="sellingPrice"
                type="number"
                value={formData.sellingPrice}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Recording...' : 'Record Procurement'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default ProcurementForm;