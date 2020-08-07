const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');


// @ROUTE         PUT api/user/:userId
// @DESCRIPTION   Edit User's profile
// @ACCESS        Private
async function editUser(req, res) {
  const { firstName, lastName, currentPassword } = req.body;
  let { newPassword } = req.body;
  const userId = req.params.userId;
  let isCurrentPasswordMatch;
  let editUserQuery = `UPDATE users SET first_name = '${firstName}', last_name = '${lastName}' WHERE user_id = '${userId}'`;
  try {
    if (currentPassword && newPassword) {
      const [userPasswordRow] = await pool.query(`SELECT password FROM users WHERE user_id = '${userId}'`);
      isCurrentPasswordMatch = await bcrypt.compare(currentPassword, userPasswordRow[0]['password']);

      if (!isCurrentPasswordMatch) {
        return res.status(400).json({ errorMsg: 'Current password does not match.' });
      }

      newPassword = await bcrypt.hash(newPassword, 10);

      editUserQuery = `UPDATE users 
        SET first_name = '${firstName}', last_name = '${lastName}', password = '${newPassword}' 
        WHERE user_id = '${userId}'`;
    }

    await pool.query(editUserQuery);

    return res.status(200).json({ successMsg: 'User profile successfully updated' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}

module.exports = {
  editUser
};