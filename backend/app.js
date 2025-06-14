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

const authRoutes = require('./routes/authRoutes');
//const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRouter')
const productRoutes = require('./routes/productRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');
const saleOffRoutes = require('./routes/saleOffRoutes');
const cartRouters = require('./routes/cartRoutes');
const uploadRoutes = require('./routes/uploadRoutes');


// API routes
app.use('/api/auth', authRoutes);
//app.use('/api/admin', adminRoutes);

app.use('/v1/api/cart',cartRouters )
app.use('/v1/api/order',orderRoutes )
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sale-offs', saleOffRoutes);
app.use('/api/upload', uploadRoutes);

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


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} at http://localhost:${PORT}`);
  console.log(`CORS configured for: ${process.env.WEB_URL || 'http://localhost:3000'}`);
});
