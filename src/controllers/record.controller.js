const recordService = require('../services/record.service');

// add a new financial transaction 
const createRecord = async (req, res, next) => {
  try {
    const record = await recordService.createRecord(req.user.id, req.body);
    res.status(201).json({
      message: 'Record created successfully',
      data: record,
    });
  } catch (err) {
    next(err);
  }
};

// fetch records with optional filters like category or type 
const listRecords = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    const records = await recordService.getRecords({ type, category, startDate, endDate });
    res.json({ data: records });
  } catch (err) {
    next(err);
  }
};

// get details for a specific record id 
const getRecordDetail = async (req, res, next) => {
  try {
    const record = await recordService.getRecordById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ data: record });
  } catch (err) {
    next(err);
  }
};

// update an existing transaction entry 
const updateRecord = async (req, res, next) => {
  try {
    const record = await recordService.updateRecord(req.params.id, req.body);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({
      message: 'Record updated successfully',
      data: record,
    });
  } catch (err) {
    next(err);
  }
};

// soft delete a record by updating is_deleted flag 
const removeRecord = async (req, res, next) => {
  try {
    const success = await recordService.deleteRecord(req.params.id);
    if (!success) return res.status(404).json({ message: 'Record not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRecord,
  listRecords,
  getRecordDetail,
  updateRecord,
  removeRecord,
};
