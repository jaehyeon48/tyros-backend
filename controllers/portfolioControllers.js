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


// @ROUTE         GET api/portfolio/:portfolioId/stocks
// @DESCRIPTION   Get Portfolio's stocks
// @ACCESS        Private
async function getPortfolioStocks(req, res) {
  const userId = req.user.id;
  const portfolioId = req.params.portfolioId;
  const getStocksQuery = `
    SELECT stocks.ticker, stocks.company_name, stocks.price, stocks.quantity, 
    stocks.transaction_type, stocks.transaction_date
    FROM users
      INNER JOIN portfolios
        ON users.user_id = ${userId} AND portfolios.portfolio_id = ${portfolioId} AND users.user_id = portfolios.owner_id 
      INNER JOIN stocks
        ON users.user_id = stocks.holder_id AND portfolios.portfolio_id = stocks.portfolio_id
      ORDER BY stocks.ticker, stocks.transaction_date, stocks.transaction_type;`;

  try {
    const [stocksRow] = await pool.query(getStocksQuery);
    res.status(200).json(stocksRow);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}


// @ROUTE         GET api/portfolio/:portfolioId/cash
// @DESCRIPTION   Get Portfolio's cash
// @ACCESS        Private
async function getPortfolioCash(req, res) {
  const userId = req.user.id;
  const portfolioId = req.params.portfolioId;
  const getCashQuery = `
    SELECT cash.amount, cash.transaction_type, cash.transaction_date
    FROM users
	    INNER JOIN portfolios
		    ON users.user_id = ${userId} AND portfolios.portfolio_id = ${portfolioId} AND users.user_id = portfolios.owner_id
	    INNER JOIN cash
		    ON users.user_id = cash.holder_id AND portfolios.portfolio_id = cash.portfolio_id
	    ORDER BY transaction_date;
  `;

  try {
    const [cashRow] = await pool.query(getCashQuery);
    res.status(200).json(cashRow);
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


// @ROUTE         PUT api/portfolio/:portfolioId
// @DESCRIPTION   Edit Portfolio's Name
// @ACCESS        Private
async function editPortfolioName(req, res) {
  const { newPortfolioName } = req.body;
  const portfolioId = req.params.portfolioId;
  try {
    await pool.query(`UPDATE portfolios SET portfolio_name = '${newPortfolioName}' WHERE portfolio_id = ${portfolioId}`);

    res.status(200).json({ successMsg: 'Successfully changed portfolio name.' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}


// @ROUTE         DELETE api/portfolio/:portfolioId
// @DESCRIPTION   DELETE an portfolio all of its related information
// @ACCESS        Private
async function deletePortfolio(req, res) {
  const portfolioId = req.params.portfolioId;

  try {
    await pool.query(`DELETE FROM cash WHERE portfolio_id = '${portfolioId}'`);
    await pool.query(`DELETE FROM stocks WHERE portfolio_id = '${portfolioId}'`);
    await pool.query(`DELETE FROM portfolios WHERE portfolio_id = '${portfolioId}'`);

    res.status(200).json({ successMsg: 'The portfolio successfully deleted.' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}

module.exports = {
  getPortfolios,
  getPortfolioStocks,
  getPortfolioCash,
  createPortfolio,
  editPortfolioName,
  deletePortfolio
};