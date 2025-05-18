require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// TN: Dùng thư viện cors để cho phép kết nối http từ client đến server
app.use(cors( 
    {
        origin: process.env.WEB_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} at http://localhost:${PORT}`);
});

