const express = require('express');
const router = express.Router();

const {
  getPortfolios,
  getPortfolioStocks,
  getPortfolioCash,
  createPortfolio,
  editPortfolioName
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

// @ROUTE         POST api/portfolio
// @DESCRIPTION   Create New Portfolio
// @ACCESS        Private
router.post('/', authMiddleware, createPortfolio);


// @ROUTE         PUT api/portfolio/:portfolioId
// @DESCRIPTION   Edit Portfolio's Name
// @ACCESS        Private
router.put('/:portfolioId', authMiddleware, editPortfolioName);

module.exports = router;