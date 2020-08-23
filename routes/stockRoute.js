const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const {
  checkMarketStatus,
  getRealTimePriceAndChange,
  getClosePrice,
  addStock,
  editStock,
  deleteStock
} = require('../controllers/stockControllers');


// @ROUTE         GET api/stock/marketStatus
// @DESCRIPTION   Check whether the exchange is opened or closed
// @ACCESS        Private
router.get('/marketStatus', authMiddleware, checkMarketStatus);

// @ROUTE         GET api/stock/realTime/:ticker
// @DESCRIPTION   Get Realtime Price and Change of the Stock
// @ACCESS        Private
router.get('/realtime/:ticker', authMiddleware, getRealTimePriceAndChange);

// @ROUTE         GET api/stock/close/:ticker
// @DESCRIPTION   Get Close Price of the Stock
// @ACCESS        Private
router.get('/close/:ticker', authMiddleware, getClosePrice);

// @ROUTE         POST api/stock
// @DESCRIPTION   Add New Stock
// @ACCESS        Private
router.post('/', authMiddleware, addStock);


// @ROUTE         PUT api/stock/:stockId
// @DESCRIPTION   Edit Stock's Information
// @ACCESS        Private
router.put('/:stockId', authMiddleware, editStock);


// @ROUTE         DELETE api/stock/:stockId
// @DESCRIPTION   Delete Stock
// @ACCESS        Private
router.delete('/:stockId', authMiddleware, deleteStock);

module.exports = router;