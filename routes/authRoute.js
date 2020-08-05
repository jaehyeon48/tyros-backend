const express = require('express');
const router = express.Router();

const {
  signUpController
} = require('../controllers/authControllers');


// @ROUTE         POST api/auth/user
// @DESCRIPTION   Register user
// @ACCESS        Public
router.post('/signup', signUpController);

module.exports = router;