const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const {
  addStock
} = require('../controllers/stockControllers');

// @ROUTE         POST api/stock
// @DESCRIPTION   Add New Stock
// @ACCESS        Private
router.post('/', authMiddleware, addStock);

module.exports = router;