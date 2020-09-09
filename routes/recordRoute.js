const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const {
  addNewRecord
} = require('../controllers/recordControllers');

// @ROUTE         POST api/record
// @DESCRIPTION   Add A New Record
// @ACCESS        Private
router.post('/', authMiddleware, addNewRecord);

module.exports = router;