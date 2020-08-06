const pool = require('../database/db');


// @ROUTE         POST api/portfolio
// @DESCRIPTION   Create New Portfolio
// @ACCESS        Private
async function createPortfolio(req, res) {
  const userId = req.user.id;
  const { portfolioName } = req.body;

  try {
    await pool.query(`INSERT INTO portfolios (portfolio_name, owner_id) VALUES ('${portfolioName}', ${userId})`);
    return res.status(201).json({ successMsg: 'New portfolio created' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}

module.exports = {
  createPortfolio
};