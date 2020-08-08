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


// @ROUTE         PUT api/stock/:stockId
// @DESCRIPTION   Edit Stock's Information
// @ACCESS        Private
async function editStock(req, res) {
  const stockId = req.params.stockId;
  const { price, quantity, transactionType, transactionDate } = req.body;
  const editStockQuery = `
    UPDATE stocks
    SET price = ${price}, quantity = ${quantity}, transaction_type = '${transactionType}',
      transaction_date = '${transactionDate}'
    WHERE stock_id = ${stockId}`;

  try {
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
    const [holderIdRow] = await pool.query(`SELECT holder_id FROM stocks WHERE stock_id = ${stockId}`);

    if (userId !== holderIdRow[0]['holder_id']) {
      return res.status(403).json({ errorMsg: 'Wrong access: You cannot delete this stock info.' });
    }
    await pool.query(`DELETE FROM stocks WHERE stock_id = ${stockId}`);

    res.status(200).json({ successMsg: 'Successfully deleted the stock ' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}


module.exports = {
  addStock,
  editStock,
  deleteStock
};