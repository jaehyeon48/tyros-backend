const axios = require('axios');
const pool = require('../database/db');


// @ROUTE         GET api/stock/marketStatus
// @DESCRIPTION   Check whether the exchange is opened or closed
// @ACCESS        Private
async function checkMarketStatus(req, res) {
  const apiUrl = `https://cloud.iexapis.com/stable/stock/aapl/quote?token=${process.env.IEX_CLOUD_API_KEY}`;

  try {
    const marketStatusResponse = await axios.get(apiUrl);
    const currentTimestamp = new Date().getTime();
    const latestTimestamp = marketStatusResponse.data.lastTradeTime;

    const minutesDifference = Math.floor((currentTimestamp - latestTimestamp) / 1000 / 60);
    if (minutesDifference > 1) {
      return res.status(200).json(false); // false for closed
    }

    return res.status(200).json(true); // true for opened
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}


// @ROUTE         GET api/stock/realTime/:ticker
// @DESCRIPTION   Get Realtime Price and Change of the Stock
// @ACCESS        Private
async function getRealTimePriceAndChange(req, res) {
  const ticker = req.params.ticker;
  const apiUrl = `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=${process.env.IEX_CLOUD_API_KEY}`;

  try {
    const response = await axios.get(apiUrl);

    const realTimeData = {
      price: response.data.iexRealtimePrice,
      change: response.data.change,
      changePercent: parseFloat((response.data.changePercent * 100).toFixed(2))
    }
    res.status(200).json(realTimeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}

// @ROUTE         GET api/stock/close/:ticker
// @DESCRIPTION   Get Close Price of the Stock
// @ACCESS        Private
async function getClosePrice(req, res) {
  const ticker = req.params.ticker;
  const apiUrl = `https://cloud.iexapis.com/stable/stock/${ticker}/quote/?token=${process.env.IEX_CLOUD_API_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    const realTimeData = {
      price: response.data.latestPrice,
      change: response.data.change,
      changePercent: parseFloat((response.data.changePercent * 100).toFixed(2))
    }
    res.status(200).json(realTimeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}

// @ROUTE         GET api/stock/sector/:ticker
// @DESCRIPTION   Get Information about the company
// @ACCESS        Private
async function getSectorInfo(req, res) {
  const ticker = req.params.ticker;
  const apiUrl = `https://cloud.iexapis.com/stable/stock/${ticker}/company?token=${process.env.IEX_CLOUD_API_KEY}`;
  try {
    const response = await axios.get(apiUrl);

    return res.status(200).json(response.data.sector);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}

// @ROUTE         GET api/stock/info/:ticker
// @DESCRIPTION   Get Information about the company
// @ACCESS        Private
async function getCompanyInfo(req, res) {
  const ticker = req.params.ticker;
  const apiUrl = `https://cloud.iexapis.com/stable/stock/${ticker}/company?token=${process.env.IEX_CLOUD_API_KEY}`;
  try {
    const response = await axios.get(apiUrl);

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}


// @ROUTE         POST api/stock
// @DESCRIPTION   Add New Stock
// @ACCESS        Private
async function addStock(req, res) {
  const userId = req.user.id;
  const { portfolioId, ticker, companyName, price, quantity, referCash, currentAvgCost, transactionType, transactionDate } = req.body;

  try {
    if (referCash) {
      if (transactionType === 'buy') {
        const cashToWithdraw = parseFloat((price * quantity).toFixed(2));
        await pool.query(`INSERT INTO cash (holderId, portfolioId, amount, transactionType, transactionDate) VALUES (${userId}, ${portfolioId}, ${cashToWithdraw}, 'withdraw', '${transactionDate}')`);
      }
      else if (transactionType === 'sell') {
        const cashToDeposit = parseFloat((price * quantity).toFixed(2));
        await pool.query(`INSERT INTO cash (holderId, portfolioId, amount, transactionType, transactionDate) VALUES (${userId}, ${portfolioId}, ${cashToDeposit}, 'deposit', '${transactionDate}')`);
      }
    }
    const addStockResult = await pool.query(`
      INSERT INTO 
      stocks (holderId, portfolioId, ticker, companyName, price, 
        quantity, transactionType, transactionDate)
      VALUES (${userId}, ${portfolioId}, '${ticker}', '${companyName}', 
        ${price}, ${quantity}, '${transactionType}', '${transactionDate}')`);

    if (transactionType === 'sell') {
      const insertedStockId = addStockResult[0].insertId; // newly created stock row's id
      console.log(insertedStockId, currentAvgCost);
      await pool.query(`
        INSERT INTO realizedStocks (stockId, avgCost)
        VALUES (${insertedStockId}, ${currentAvgCost})
      `);
    }

    return res.status(201).json({ successMsg: 'Stock successfully added.' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}


// @ROUTE         PUT api/stock/:stockId
// @DESCRIPTION   Edit Stock's Information
// @ACCESS        Private
async function editStock(req, res) {
  const userId = req.user.id;
  const stockId = req.params.stockId;
  const { price, quantity, transactionType, transactionDate, currentAvgCost } = req.body;

  const editStockQuery = `
    UPDATE stocks
    SET price = ${price}, quantity = ${quantity}, transactionType = '${transactionType}',
      transactionDate = '${transactionDate}'
    WHERE stockId = ${stockId}`;

  try {
    const [holderIdRow] = await pool.query(`SELECT holderId FROM stocks WHERE stockId = ${stockId}`);

    if (userId !== holderIdRow[0].holderId) {
      return res.status(403).json({ errorMsg: 'Wrong access: You cannot delete this stock info.' });
    }

    const [previousTrTypeRow] = await pool.query(`SELECT transactionType FROM stocks WHERE stockId = ${stockId}`);


    // insert new realized return info
    if (previousTrTypeRow[0].transactionType === 'buy' && transactionType === 'sell') {
      await pool.query(`
        INSERT INTO realizedStocks (stockId, avgCost)
        VALUES (${stockId}, ${currentAvgCost})
      `);
    }
    // delete realized return info
    else if (previousTrTypeRow[0].transactionType === 'sell' && transactionType === 'buy') {
      await pool.query(`DELETE FROM realizedStocks WHERE stockId = ${stockId}`);
    }

    await pool.query(editStockQuery);

    res.status(200).json({ successMsg: 'Successfully edited the stock info' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}


// @ROUTE         DELETE api/stock/:stockId
// @DESCRIPTION   Delete Stock
// @ACCESS        Private
async function deleteStock(req, res) {
  const stockId = req.params.stockId;
  const userId = req.user.id;
  try {
    const [holderIdRow] = await pool.query(`SELECT holderId FROM stocks WHERE stockId = ${stockId}`);

    if (userId !== holderIdRow[0].holderId) {
      return res.status(403).json({ errorMsg: 'Wrong access: You cannot delete this stock info.' });
    }

    await pool.query(`DELETE FROM realizedStocks WHERE stockId = ${stockId}`);
    await pool.query(`DELETE FROM stocks WHERE stockId = ${stockId}`);

    res.status(200).json({ successMsg: 'Successfully deleted the stock' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}

// @ROUTE         DELETE api/stock/:portfolioId/:ticker
// @DESCRIPTION   Close position
// @ACCESS        Private
async function closePosition(req, res) {
  const userId = req.user.id;
  const portfolioId = req.params.portfolioId;
  const ticker = req.params.ticker;

  try {
    await pool.query(`DELETE FROM stocks WHERE holderId = ${userId} AND portfolioId = ${portfolioId} AND ticker = '${ticker}'`);

    res.status(200).json({ successMsg: 'Successfully closed the position' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}


module.exports = {
  checkMarketStatus,
  getRealTimePriceAndChange,
  getClosePrice,
  getSectorInfo,
  getCompanyInfo,
  addStock,
  editStock,
  deleteStock,
  closePosition
};