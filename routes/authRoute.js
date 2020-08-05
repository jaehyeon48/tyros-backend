const express = require('express');
const router = express.Router();

const {
  loginController,
  signUpController
} = require('../controllers/authControllers');


// @ROUTE         POST api/auth/login
// @DESCRIPTION   Login user
// @ACCESS        Public
router.post('/login', loginController);

// @ROUTE         POST api/auth/signup
// @DESCRIPTION   Register user
// @ACCESS        Public
router.post('/signup', signUpController);

module.exports = router;