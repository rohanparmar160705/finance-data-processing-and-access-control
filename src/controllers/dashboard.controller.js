const dashboardService = require('../services/dashboard.service');

// get main dashboard totals and net balance 
const getSummary = async (req, res, next) => {
  try {
    const summary = await dashboardService.getFinancialSummary();
    res.json({ data: summary });
  } catch (err) {
    next(err);
  }
};

// get breakdown of spending and income by category 
const getCategories = async (req, res, next) => {
  try {
    const categories = await dashboardService.getCategoryBreakdown();
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
};

// get the last 5-10 activities for the dashboard activity log 
const getRecent = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const recent = await dashboardService.getRecentActivity(limit);
    res.json({ data: recent });
  } catch (err) {
    next(err);
  }
};

// get monthly trend data for line charts 
const getTrends = async (req, res, next) => {
  try {
    const trends = await dashboardService.getMonthlyTrends();
    res.json({ data: trends });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSummary,
  getCategories,
  getRecent,
  getTrends,
};
