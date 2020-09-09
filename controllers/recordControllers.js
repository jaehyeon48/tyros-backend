const pool = require('../database/db');

// @ROUTE         POST api/record
// @DESCRIPTION   Add A New Record
// @ACCESS        Private
async function addNewRecord(req, res) {
  const userId = req.user.id;
  const { dailyReturn, totalValue } = req.body;

  try {
    await pool.query(`INSERT INTO dailyRecords (userId, dailyReturn, totalValue)
    VALUES (${userId}, ${dailyReturn}, ${totalValue})`);
    return res.status(201).json({ successMsg: 'Daily record successfully added.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}

module.exports = {
  addNewRecord
};