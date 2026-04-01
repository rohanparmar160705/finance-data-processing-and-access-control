const pool = require('../config/db');

// create a new financial record 
const createRecord = async (userId, { amount, type, category, record_date, notes }) => {
  const result = await pool.query(
    `INSERT INTO financial_records (user_id, amount, type, category, record_date, notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, amount, type, category, record_date, notes]
  );
  return result.rows[0];
};

// get all records with optional filtering (type, category, date) and pagination 
const getRecords = async ({ type, category, startDate, endDate, limit = 10, offset = 0 }) => {
  const fields = ['is_deleted = FALSE'];
  const values = [];
  let idx = 1;

  if (type) {
    fields.push(`type = $${idx++}`);
    values.push(type);
  }
  if (category) {
    fields.push(`category = $${idx++}`);
    values.push(category);
  }
  if (startDate) {
    fields.push(`record_date >= $${idx++}`);
    values.push(startDate);
  }
  if (endDate) {
    fields.push(`record_date <= $${idx++}`);
    values.push(endDate);
  }

  // query for the actual data with limit and offset 
  const dataQuery = `
    SELECT * FROM financial_records
    WHERE ${fields.join(' AND ')}
    ORDER BY record_date DESC, created_at DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;

  // query for the total count of matching records 
  const countQuery = `
    SELECT COUNT(*) FROM financial_records
    WHERE ${fields.join(' AND ')}
  `;

  const dataRes = await pool.query(dataQuery, [...values, limit, offset]);
  const countRes = await pool.query(countQuery, values);

  return {
    records: dataRes.rows,
    total: parseInt(countRes.rows[0].count),
  };
};

// get a single record by id 
const getRecordById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM financial_records WHERE id = $1 AND is_deleted = FALSE',
    [id]
  );
  return result.rows[0];
};

// update an existing record 
const updateRecord = async (id, updates) => {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(value);
    }
  }

  if (fields.length === 0) return null;

  values.push(id);
  const result = await pool.query(
    `UPDATE financial_records
     SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $${idx} AND is_deleted = FALSE
     RETURNING *`,
    values
  );

  return result.rows[0];
};

// soft delete a record 
const deleteRecord = async (id) => {
  const result = await pool.query(
    `UPDATE financial_records
     SET is_deleted = TRUE, updated_at = NOW()
     WHERE id = $1 AND is_deleted = FALSE
     RETURNING id`,
    [id]
  );
  return result.rows.length > 0;
};

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
