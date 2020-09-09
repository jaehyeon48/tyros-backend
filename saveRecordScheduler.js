const axios = require('axios');
const pool = require('./database/db');
require('dotenv').config();

async function saveRecordScheduler() {
  if (checkMarketWasOpened()) {
    const portfolios = await getAllPortfolios();

    for (const portfolioId of portfolios) {
      const userId = await getUserIdByPortfolioId(portfolioId);
    }
  }
}


// Check if the market 'was' opened for the day by comparing timestamp between current timestamp
// and IEX api's timestamp and if the difference between the two is less than 35 minutes,
// return true. The reason of 35 minutes is the schedule is running at 8:30PM UTC (which is 30 minutes
// after the market's official closing time) plus 5 minutes of margin in case of a latency.
async function checkMarketWasOpened() {
  const apiUrl = `https://cloud.iexapis.com/stable/stock/aapl/quote?token=${process.env.IEX_CLOUD_API_KEY}`;

  try {
    const marketStatusResponse = await axios.get(apiUrl);
    const currentTimestamp = new Date().getTime();
    const latestTimestamp = marketStatusResponse.data.lastTradeTime;

    const minutesDifference = Math.floor((currentTimestamp - latestTimestamp) / 1000 / 60);
    if (minutesDifference < 35) {
      return true;
    }
    else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function getUserIdByPortfolioId(portfolioId) {
  try {
    const [userListRows] = await pool.query(`SELECT ownerId FROM portfolios WHERE portfolioId = ${portfolioId}`);

    return userListRows[0];
  } catch (error) {
    console.error(error);
  }
}

async function getAllPortfolios() {
  const portfolioIds = [];
  try {
    const [portfoliosRow] = await pool.query('SELECT portfolioId FROM portfolios ORDER BY portfolioId asc');

    portfoliosRow.forEach((portfolio) => {
      portfolioIds.push(portfolio.portfolioId);
    });

    return portfolioIds;
  } catch (error) {
    console.error(error);
  }
}

async function getStockData(userId, portfolioId) {
  try {
    const getStocksQuery = `
    SELECT stocks.ticker, stocks.companyName, stocks.price, stocks.quantity, 
    stocks.transactionType, stocks.transactionDate
    FROM users
      INNER JOIN portfolios
        ON users.userId = ${userId} AND portfolios.portfolioId = ${portfolioId} AND users.userId = portfolios.ownerId 
      INNER JOIN stocks
        ON users.userId = stocks.holderId AND portfolios.portfolioId = stocks.portfolioId
      ORDER BY stocks.ticker, stocks.transactionDate, stocks.transactionType;`;
    const [stocksRow] = await pool.query(getStocksQuery);
    console.log(stocksRow);
  } catch (error) {
    console.error(error);
  }
}

saveRecordScheduler();