const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// all dashboard routes require authentication 
router.use(auth);

// get core financial summary 
router.get('/summary', authorize('VIEW_DASHBOARD'), dashboardController.getSummary);

// get category-wise breakdowns 
router.get('/categories', authorize('VIEW_DASHBOARD'), dashboardController.getCategories);

// get last 5-10 transactions 
router.get('/recent', authorize('VIEW_DASHBOARD'), dashboardController.getRecent);

// get trend data for charts 
router.get('/trends', authorize('VIEW_DASHBOARD'), dashboardController.getTrends);

module.exports = router;
