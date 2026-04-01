const pool = require('../config/db');

// check if user has the specific permission required 
const authorize = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      const query = `
        SELECT p.name
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        JOIN users u ON rp.role_id = u.role_id
        WHERE u.id = $1 AND p.name = $2
      `;

      const result = await pool.query(query, [userId, requiredPermission]);

      if (result.rows.length === 0) {
        return res.status(403).json({
          message: 'Access denied: You do not have the required permission',
        });
      }

      next();
    } catch (err) {
      console.error('Authorization error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = authorize;
