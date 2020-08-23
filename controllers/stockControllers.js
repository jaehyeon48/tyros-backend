const axios = require('axios');
const pool = require('../database/db');


// @ROUTE         GET api/stock/marketStatus
// @DESCRIPTION   Check whether the exchange is opened or closed
// @ACCESS        Private
async function checkMarketStatus(req, res) {
  const apiUrl = `https://cloud.iexapis.com/stable/stock/aapl/quote?token=${process.env.IEX_CLOUD_API_KEY}`;

  try {
    const marketStatusResponse = await axios.get(apiUrl);

    if (marketStatusResponse.data.iexRealTimePrice === undefined) {
      return res.status(200).send(false); // false for closed
    }

    return res.status(200).send(true); // true for opened
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
      price: response.data.iexRealTimePrice,
      change: response.data.change,
      changePercent: response.data.changePercent * 100
    }
    res.status(200).json(realTimeData);
  } catch (error) {
    console.error(error);
  }
}

// @ROUTE         POST api/stock
// @DESCRIPTION   Add New Stock
// @ACCESS        Private
async function addStock(req, res) {
  const userId = req.user.id;
  const { portfolioId, ticker, companyName, price, quantity, transactionType, transactionDate } = req.body;

  try {
    await pool.query(`
      INSERT INTO 
      stocks (holderId, portfolioId, ticker, companyName, price, 
        quantity, transactionType, transactionDate)
      VALUES (${userId}, ${portfolioId}, '${ticker}', '${companyName}', 
        ${price}, ${quantity}, '${transactionType}', '${transactionDate}')`);

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
  const { price, quantity, transactionType, transactionDate } = req.body;
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

    await pool.query(`DELETE FROM stocks WHERE stockId = ${stockId}`);

    res.status(200).json({ successMsg: 'Successfully deleted the stock ' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}


module.exports = {
  checkMarketStatus,
  getRealTimePriceAndChange,
  addStock,
  editStock,
  deleteStock
};