const express = require('express');
const router = express.Router();

const recordController = require('../controllers/record.controller');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const validate = require('../validations/validate');
const { createRecordSchema, updateRecordSchema } = require('../validations/record.schema');

// all record routes require authentication 
router.use(auth);

// list of all records with filters - any role can view 
router.get('/', authorize('VIEW_RECORD'), recordController.listRecords);

// create a new record - analyst and admin only 
router.post('/', authorize('CREATE_RECORD'), validate(createRecordSchema), recordController.createRecord);

// get a single record by id - any role can view 
router.get('/:id', authorize('VIEW_RECORD'), recordController.getRecordDetail);

// update a record - analyst and admin only 
router.patch('/:id', authorize('UPDATE_RECORD'), validate(updateRecordSchema), recordController.updateRecord);

// delete a record - admin only 
router.delete('/:id', authorize('DELETE_RECORD'), recordController.removeRecord);

module.exports = router;
