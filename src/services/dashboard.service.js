const pool = require('../config/db');

// get core financial totals: income, expense, and net balance 
const getFinancialSummary = async () => {
  const result = await pool.query(`
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as net_balance,
      COUNT(*) as total_records
    FROM financial_records
    WHERE is_deleted = FALSE
  `);
  return result.rows[0];
};

// get breakdown of totals grouped by category 
const getCategoryBreakdown = async () => {
  const result = await pool.query(`
    SELECT 
      category, 
      type,
      SUM(amount) as total_amount,
      COUNT(*) as record_count
    FROM financial_records
    WHERE is_deleted = FALSE
    GROUP BY category, type
    ORDER BY total_amount DESC
  `);
  return result.rows;
};

// get most recent transactions across the system 
const getRecentActivity = async (limit = 5) => {
  const result = await pool.query(`
    SELECT r.*, u.name as user_name
    FROM financial_records r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.is_deleted = FALSE
    ORDER BY r.record_date DESC, r.created_at DESC
    LIMIT $1
  `, [limit]);
  return result.rows;
};

// get monthly income and expense trends 
const getMonthlyTrends = async () => {
  const result = await pool.query(`
    SELECT 
      DATE_TRUNC('month', record_date) as month,
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
    FROM financial_records
    WHERE is_deleted = FALSE
      AND record_date >= DATE_TRUNC('month', NOW()) - INTERVAL '12 months'
    GROUP BY month
    ORDER BY month ASC
  `);
  return result.rows;
};

module.exports = {
  getFinancialSummary,
  getCategoryBreakdown,
  getRecentActivity,
  getMonthlyTrends,
};
