const pool = require('../database/db');


// @ROUTE         GET api/portfolio
// @DESCRIPTION   Get all of the user's portfolios
// @ACCESS        Private
async function getPortfolios(req, res) {
  const userId = req.user.id;
  try {
    const [userPortfolios] = await pool.query(`SELECT portfolio_id, portfolio_name FROM portfolios WHERE owner_id = '${userId}'`);

    res.status(200).json(userPortfolios);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}


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
  getPortfolios,
  createPortfolio
};