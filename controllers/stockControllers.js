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
  addStock,
  editStock,
  deleteStock
};