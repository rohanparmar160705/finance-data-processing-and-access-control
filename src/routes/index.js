const express = require('express');
const router = express.Router();

// combine all route modules here 
router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/records', require('./record.routes'));
router.use('/dashboard', require('./dashboard.routes'));

module.exports = router;