const pool = require('../database/db');


// @ROUTE         GET api/record/10days
// @DESCRIPTION   Get Recent 10 Records
// @ACCESS        Private
async function getRecordsBy10(req, res) {
  const userId = req.user.id;

  try {
    const [recordsRow] = await pool.query(`SELECT dailyReturn, totalValue, recordDate FROM dailyRecords WHERE userId = ${userId} ORDER BY recordDate desc LIMIT 10`);

    recordsRow.reverse(); // make records sorted by date in ascending order
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

  try {
    await pool.query(`INSERT INTO dailyRecords (userId, dailyReturn, totalValue, recordDate)
    VALUES (${userId}, ${dailyReturn}, ${totalValue}, '${recordDate}')`);
    return res.status(201).json({ successMsg: 'Daily record successfully added.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}

async function deleteUsersRecords(req, res) {
  const userId = req.user.id;

  try {
    await pool.query(`DELETE FROM dailyRecords WHERE userId = ${userId}`);
    return res.status(200).json({ successMsg: 'Deleted all of user\'s records successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}

module.exports = {
  getRecordsBy10,
  addNewRecord,
  deleteUsersRecords
};