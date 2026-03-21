const express = require('express');
const { getDashboardData } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', protect, getDashboardData);

module.exports = router;
