require('dotenv').config();

function testfunc() {
  console.log('hello world');
}

function checkMarketWasOpened() {
  // const apiUrl = `https://cloud.iexapis.com/stable/stock/aapl/quote?token=${process.env.IEX_CLOUD_API_KEY}`;

  console.log(process.env.IEX_CLOUD_API_KEY);
}

checkMarketWasOpened();