const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const {
  addCash
} = require('../controllers/cashControllers');


// @ROUTE         POST api/cash
// @DESCRIPTION   Add New Cash
// @ACCESS        Private
router.post('/', authMiddleware, addCash);

module.exports = router;