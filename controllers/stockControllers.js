const pool = require('../database/db');


// @ROUTE         POST api/stock
// @DESCRIPTION   Add New Stock
// @ACCESS        Private
async function addStock(req, res) {
  const userId = req.user.id;
  const { portfolioId, ticker, companyName, price, quantity, transactionType, transactionDate } = req.body;

  try {
    await pool.query(`
      INSERT INTO 
      stocks (holder_id, portfolio_id, ticker, company_name, price, 
        quantity, transaction_type, transaction_date)
      VALUES (${userId}, ${portfolioId}, '${ticker}', '${companyName}', 
        ${price}, ${quantity}, '${transactionType}', '${transactionDate}')`);

    return res.status(201).json({ successMsg: 'Stock successfully added.' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}

module.exports = {
  addStock
};