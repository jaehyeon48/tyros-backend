const axios = require('axios');
const pool = require('./database/db');
require('dotenv').config();

async function saveRecordScheduler() {
  if (checkMarketWasOpened()) {
    const users = await getAllUsers();
    const portfolios = [];
    const stocks = [];

    // Get all portfolio IDs from each user
    for (const userId of users) {
      const portfolioIds = await getUsersPortfolios(userId);

      portfolios.push(portfolioIds);
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

async function getAllUsers() {
  const userIds = [];
  try {
    const [userListRows] = await pool.query('SELECT userId FROM users ORDER BY userId asc');

    userListRows.forEach((user) => {
      userIds.push(user.userId);
    });

    return userIds;
  } catch (error) {
    console.error(error);
  }
}

async function getUsersPortfolios(userId) {
  const portfolioIds = [];
  try {
    const [portfoliosRow] = await pool.query(`SELECT portfolioId FROM portfolios WHERE ownerId = ${userId} ORDER BY portfolioId asc`);


    portfoliosRow.forEach((portfolio) => {
      portfolioIds.push(portfolio.portfolioId);
    });

    return portfolioIds;
  } catch (error) {
    console.error(error);
  }
}

saveRecordScheduler();