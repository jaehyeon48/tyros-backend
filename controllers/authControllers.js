const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../database/db');

// @ROUTE         POST api/auth/user
// @DESCRIPTION   Register user
// @ACCESS        Public
async function signUpController(req, res) {
  const { firstName, lastName, email, password } = req.body;

  try {
    const checkExistUser = await pool.query(`SELECT user_id FROM users WHERE email = '${email}'`);

    if (checkExistUser[0].length !== 0) {
      return res.status(400).json({ errorMsg: 'User already exists!' });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (first_name, last_name, email, password)
       VALUES ('${firstName}', '${lastName}', '${email}', '${encryptedPassword}')`
    );

    const [userIdRow] = await pool.query(`SELECT user_id FROM users WHERE email = '${email}'`);

    const newUserId = userIdRow[0]['user_id'];

    const jwtPayload = {
      user: { id: newUserId }
    };

    jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '12' }, (err, token) => { // set expiresIn 12h for testing purpose.
      if (err) throw err;
      res.status(200).cookie('token', token, { httpOnly: true, sameSite: true }).send('User successfully created.');
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  signUpController
};