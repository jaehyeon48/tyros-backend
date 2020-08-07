const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const { editUser } = require('../controllers/userControllers');


// @ROUTE         PUT api/user/:userId
// @DESCRIPTION   Edit User's profile
// @ACCESS        Private
router.put('/:userId', authMiddleware, editUser);

module.exports = router;