const express = require('express');
const router = express.Router();

const {
  getPortfolios,
  createPortfolio
} = require('../controllers/portfolioControllers');

const authMiddleware = require('../middlewares/authMiddleware');


// @ROUTE         GET api/portfolio
// @DESCRIPTION   Get all of the user's portfolios
// @ACCESS        Private
router.get('/', authMiddleware, getPortfolios);


// @ROUTE         POST api/portfolio
// @DESCRIPTION   Create New Portfolio
// @ACCESS        Private
router.post('/', authMiddleware, createPortfolio);

module.exports = router;