// Vercel Serverless Function Entry Point
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Note: File uploads are now handled by Supabase Storage
// No need to serve static files from local filesystem in Vercel

// Routes - Note: In Vercel, /api/* routes are handled by this function
// So we don't need /api prefix in the route definitions
app.use('/auth', require('../backend/routes/auth'));
app.use('/reports', require('../backend/routes/reports'));
app.use('/users', require('../backend/routes/users'));
app.use('/', require('../backend/routes/email'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'ESSU Water Maintenance API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint for API
app.get('/', (req, res) => {
    res.json({ 
        message: 'ESSU Water Maintenance API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            reports: '/api/reports',
            users: '/api/users'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Export for Vercel
module.exports = app;

