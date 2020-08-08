const pool = require('../database/db');


// @ROUTE         POST api/cash
// @DESCRIPTION   Add New Cash
// @ACCESS        Private
async function addCash(req, res) {
  const userId = req.user.id;
  const { portfolioId, amount, transactionType, transactionDate } = req.body;
  const addCashQuery = `
    INSERT INTO cash (holder_id, portfolio_id, amount, transaction_type, transaction_date)
    VALUES (${userId}, ${portfolioId}, ${amount}, '${transactionType}', '${transactionDate}')`;
  try {
    await pool.query(addCashQuery);

    res.status(201).json({ successMsg: 'Successfully added new cash info.' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}


// @ROUTE         PUT api/cash/:cashId
// @DESCRIPTION   Edit Stock's Information
// @ACCESS        Private
async function editCash(req, res) {
  const cashId = req.params.cashId;
  const { amount, transactionType, transactionDate } = req.body;
  const editCashQuery = `
    UPDATE cash
    SET amount = ${amount}, transaction_type = '${transactionType}', transaction_date = '${transactionDate}'
    WHERE cash_id = ${cashId}`;

  try {
    await pool.query(editCashQuery);

    res.status(200).json({ successMsg: 'Successfully edited the cash info.' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}

module.exports = {
  addCash,
  editCash
};