require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;

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

// routes
const productRoutes = require('./routes/product')
const cartRouters = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRouter')

app.use('/v1/api/',productRoutes )
app.use('/v1/api/',cartRouters )
app.use('/v1/api/',orderRoutes )

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} at http://localhost:${PORT}`);
});

