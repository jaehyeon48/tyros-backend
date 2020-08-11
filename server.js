const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

require('./database/db'); // connect to DB

const app = express();

// handling CORS
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
  res.set('Access-Control-Allow-Credentials', true);
  res.set("Access-Control-Max-Age", "3600");
  next();
});
app.use(express.json({ extended: false }));
app.use(cookieParser());

app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/portfolio', require('./routes/portfolioRoute'));
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/stock', require('./routes/stockRoute'));
app.use('/api/cash', require('./routes/cashRoute'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));