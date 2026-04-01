const pool = require('../config/db');
const bcrypt = require('bcrypt');

// create a new user and hash their password 
const createUser = async ({ name, email, password, role_id }) => {
  // hash password before saving 
  const hashed = await bcrypt.hash(password, 10);

  const roleQuery = role_id
    ? 'SELECT id FROM roles WHERE id = $1'
    : "SELECT id FROM roles WHERE name = 'viewer'";

  // get the correct role id 
  const roleRes = await pool.query(roleQuery, role_id ? [role_id] : []);
  const finalRoleId = roleRes.rows[0].id;

  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, role_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email`,
    [name, email, hashed, finalRoleId]
  );

  return result.rows[0];
};

// check credentials and return user info 
const loginUser = async ({ email, password }) => {
  const result = await pool.query(
    `SELECT u.*, r.name as role
     FROM users u
     LEFT JOIN roles r ON u.role_id = r.id
     WHERE email = $1`,
    [email]
  );

  const user = result.rows[0];
  if (!user) throw { status: 400, message: 'Invalid credentials' };

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw { status: 400, message: 'Invalid credentials' };

  return user;
};

module.exports = {
  createUser,
  loginUser,
};