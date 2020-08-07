const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const {
  editUser,
  deleteUser
} = require('../controllers/userControllers');


// @ROUTE         PUT api/user/:userId
// @DESCRIPTION   Edit User's profile
// @ACCESS        Private
router.put('/:userId', authMiddleware, editUser);


// @ROUTE         DELETE api/user/:userId
// @DESCRIPTION   Delete user's account and all of its related information
// @ACCESS        Private
router.delete('/:userId', authMiddleware, deleteUser);

module.exports = router;