require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


// CORS configuration
app.use(cors({
  origin: process.env.WEB_URL || 'http://localhost:5137',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Import routes
const authRoutes = require('./routes/authRoutes');
//const adminRoutes = require('./routes/adminRoutes');
//const productRoutes = require('./routes/productRoutes'); 
//const categoryRoutes = require('./routes/categoryRoutes');

// API routes
app.use('/api/auth', authRoutes);
//app.use('/api/admin', adminRoutes);
//app.use('/api/products', productRoutes);
//app.use('/api/categories', categoryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Global error handler
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} at http://localhost:${PORT}`);
  console.log(`CORS configured for: ${process.env.WEB_URL || 'http://localhost:3000'}`);
});
