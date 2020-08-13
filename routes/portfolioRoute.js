const express = require('express');
const router = express.Router();

const {
  getPortfolios,
  getPortfolioStocks,
  getSelectedPortfolio,
  getPortfolioCash,
  getStockInfoByTickerGroup,
  createPortfolio,
  selectPortfolio,
  editPortfolioName,
  deletePortfolio,
} = require('../controllers/portfolioControllers');

const authMiddleware = require('../middlewares/authMiddleware');


// @ROUTE         GET api/portfolio
// @DESCRIPTION   Get all of the user's portfolios
// @ACCESS        Private
router.get('/', authMiddleware, getPortfolios);


// @ROUTE         GET api/portfolio/:portfolioId/stocks
// @DESCRIPTION   Get Portfolio's stocks
// @ACCESS        Private
router.get('/:portfolioId/stocks', authMiddleware, getPortfolioStocks);


// @ROUTE         GET api/portfolio/:portfolioId/cash
// @DESCRIPTION   Get Portfolio's cash
// @ACCESS        Private
router.get('/:portfolioId/cash', authMiddleware, getPortfolioCash);


// @ROUTE         GET api/portfolio/:portfolioId/:tickerName
// @DESCRIPTION   Get Information of the Ticker Group in the portfolio
// @ACCESS        Private
router.get('/:portfolioId/:tickerName', authMiddleware, getStockInfoByTickerGroup);


// @ROUTE         GET api/portfolio/select
// @DESCRIPTION   Fetch selected portfolio
// @ACCESS        Private
router.get('/select', authMiddleware, getSelectedPortfolio);


// @ROUTE         POST api/portfolio
// @DESCRIPTION   Create New Portfolio
// @ACCESS        Private
router.post('/', authMiddleware, createPortfolio);


// @ROUTE         POST api/portfolio/select
// @DESCRIPTION   Save selected portfolio into the DB
// @ACCESS        Private
router.post('/select', authMiddleware, selectPortfolio);


// @ROUTE         PUT api/portfolio/:portfolioId
// @DESCRIPTION   Edit Portfolio's Name
// @ACCESS        Private
router.put('/:portfolioId', authMiddleware, editPortfolioName);


// @ROUTE         DELETE api/portfolio/:portfolioId
// @DESCRIPTION   DELETE an portfolio all of its related information
// @ACCESS        Private
router.delete('/:portfolioId', authMiddleware, deletePortfolio);

module.exports = router;