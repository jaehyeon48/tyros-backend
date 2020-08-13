const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');


// @ROUTE         PUT api/user
// @DESCRIPTION   Edit User's profile
// @ACCESS        Private
async function editUser(req, res) {
  const userId = req.user.id;
  const { firstName, lastName, currentPassword } = req.body;
  let { newPassword } = req.body;
  let isCurrentPasswordMatch;
  let editUserQuery = `UPDATE users SET first_name = '${firstName}', last_name = '${lastName}' WHERE user_id = '${userId}'`;
  try {
    const [isUserExist] = await pool.query(`SELECT user_id FROM users WHERE user_id = ${userId}`);

    if (!isUserExist[0]) {
      return res.status(400).json({ errorMsg: 'The user does not exist.' });
    }

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


// @ROUTE         DELETE api/user
// @DESCRIPTION   Delete user's account and all of its related information
// @ACCESS        Private
async function deleteUser(req, res) {
  const userId = req.user.id;
  try {
    const [isUserExist] = await pool.query(`SELECT user_id FROM users WHERE user_id = ${userId}`);

    if (!isUserExist[0]) {
      return res.status(400).json({ errorMsg: 'The user does not exist.' });
    }

    await pool.query(`DELETE FROM cash WHERE holder_id = ${userId}`);
    await pool.query(`DELETE FROM stocks WHERE holder_id = ${userId}`);
    await pool.query(`DELETE FROM selected_portfolio WHERE user_id = ${userId}`);
    await pool.query(`DELETE FROM portfolios WHERE owner_id = ${userId}`);
    await pool.query(`DELETE FROM users WHERE user_id = ${userId}`);

    res.status(200).json({ successMsg: 'The account successfully deleted!' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
}

module.exports = {
  editUser,
  deleteUser
};