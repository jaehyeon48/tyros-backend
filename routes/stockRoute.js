const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const {
  addStock,
  editStock,
  deleteStock
} = require('../controllers/stockControllers');

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