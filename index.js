require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;

const  supabase  = require('./config/supabaseClient'); // import Supabase client

// Route: /users -> in ra danh sách user
app.get('/users', async (req, res) => {
    
    const { data, error } = await supabase.from('account').select('*');
    if (error) {
    console.error('❌ Không thể kết nối Supabase:', error.message);
    } else {
    console.log('✅ Đã kết nối Supabase thành công!');
    }


  //console.log('Danh sách người dùng:', data); // In ra terminal
  res.json(data); // Trả về response cho client
});

// Start server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} at http://localhost:${PORT}`);
  console.log(`CORS configured for: ${process.env.WEB_URL || 'http://localhost:3000'}`);
});
