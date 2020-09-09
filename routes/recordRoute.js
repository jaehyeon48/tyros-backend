const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const {
  getRecord,
  addNewRecord,
  deleteUsersRecords
} = require('../controllers/recordControllers');


// @ROUTE         GET api/record
// @DESCRIPTION   Get A Record
// @ACCESS        Private
router.get('/', authMiddleware, getRecord);

// @ROUTE         POST api/record
// @DESCRIPTION   Add A New Record
// @ACCESS        Private
router.post('/', authMiddleware, addNewRecord);

// @ROUTE         DELETE api/record
// @DESCRIPTION   Delete All of User's Record
// @ACCESS        Private
router.delete('/', authMiddleware, deleteUsersRecords);

module.exports = router;