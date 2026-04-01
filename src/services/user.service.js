const pool = require('../config/db');

// get all users and their assigned roles 
// get all users and their assigned roles with pagination 
const getAllUsers = async (limit = 10, offset = 0) => {
  const dataRes = await pool.query(`
    SELECT u.id, u.name, u.email, u.status, r.name as role
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    ORDER BY u.created_at DESC
    LIMIT $1 OFFSET $2
  `, [limit, offset]);
  
  const countRes = await pool.query('SELECT COUNT(*) FROM users');
  
  return {
    users: dataRes.rows,
    total: parseInt(countRes.rows[0].count),
  };
};

// get profile plus permissions for a specific user 
const getUserProfile = async (userId) => {
  const userResult = await pool.query(`
    SELECT u.id, u.name, u.email, u.status, r.name as role
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = $1
  `, [userId]);

  if (userResult.rows.length === 0) return null;

  const permissionsResult = await pool.query(`
    SELECT p.name
    FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permission_id
    JOIN users u ON rp.role_id = u.role_id
    WHERE u.id = $1
  `, [userId]);

  const user = userResult.rows[0];
  user.permissions = permissionsResult.rows.map(row => row.name);

  return user;
};

// partial update for user role or status 
const updateUser = async (id, { role_id, status }) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (role_id) {
    fields.push(`role_id = $${idx++}`);
    values.push(role_id);
  }
  if (status) {
    fields.push(`status = $${idx++}`);
    values.push(status);
  }

  if (fields.length === 0) return null;

  values.push(id);
  const result = await pool.query(`
    UPDATE users
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${idx}
    RETURNING id, name, email, status, role_id
  `, values);

  return result.rows[0];
};

module.exports = {
  getAllUsers,
  getUserProfile,
  updateUser,
};
