const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const {
  getRecord,
  addNewRecord
} = require('../controllers/recordControllers');


// @ROUTE         GET api/record
// @DESCRIPTION   Get A Record
// @ACCESS        Private
router.get('/', authMiddleware, getRecord);

// @ROUTE         POST api/record
// @DESCRIPTION   Add A New Record
// @ACCESS        Private
router.post('/', authMiddleware, addNewRecord);

module.exports = router;