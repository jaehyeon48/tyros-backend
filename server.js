const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors')
require('dotenv').config();

require('./database/db'); // connect to DB

const app = express();

// handling CORS
app.use(cors({
  origin: /^https?:\/\/tyros\.s3-website-us-east-1\.amazonaws\.com.*$/,
  methods: 'GET,POST,PUT,PATCH,DELETE',
  allowedHeaders: 'Content-Type,X-Requested-With',
  credentials: true,
  maxAge: 3600
}));
app.use(express.json({ extended: false }));
app.use(cookieParser());

app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/portfolio', require('./routes/portfolioRoute'));
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/stock', require('./routes/stockRoute'));
app.use('/api/cash', require('./routes/cashRoute'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));