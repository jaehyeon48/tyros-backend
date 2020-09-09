const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const {
  getRecordsBy10,
  addNewRecord,
  deleteUsersRecords
} = require('../controllers/recordControllers');


// @ROUTE         GET api/records/10days/:portfolioId
// @DESCRIPTION   Get Recent 10 Records
// @ACCESS        Private
router.get('/10days/:portfolioId', authMiddleware, getRecordsBy10);

// @ROUTE         POST api/record/:portfolioId
// @DESCRIPTION   Add A New Record
// @ACCESS        Private
router.post('/:portfolioId', authMiddleware, addNewRecord);

// @ROUTE         DELETE api/record
// @DESCRIPTION   Delete All of User's Record
// @ACCESS        Private
router.delete('/', authMiddleware, deleteUsersRecords);

module.exports = router;