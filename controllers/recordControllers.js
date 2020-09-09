const pool = require('../database/db');


// @ROUTE         GET api/record
// @DESCRIPTION   Get A Record
// @ACCESS        Private
async function getRecord(req, res) {
  const userId = req.user.id;

  try {
    const [recordsRow] = await pool.query(`SELECT dailyReturn, totalValue, recordDate FROM dailyRecords WHERE userId = ${userId} ORDER BY recordDate asc`);
    return res.status(200).json({ records: recordsRow });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}

// @ROUTE         POST api/record
// @DESCRIPTION   Add A New Record
// @ACCESS        Private
async function addNewRecord(req, res) {
  const userId = req.user.id;
  const { dailyReturn, totalValue, recordDate } = req.body;

  console.log(dailyReturn, totalValue, recordDate)

  try {
    await pool.query(`INSERT INTO dailyRecords (userId, dailyReturn, totalValue, recordDate)
    VALUES (${userId}, ${dailyReturn}, ${totalValue}, '${recordDate}')`);
    return res.status(201).json({ successMsg: 'Daily record successfully added.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}

module.exports = {
  getRecord,
  addNewRecord
};