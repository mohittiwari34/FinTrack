const express = require('express');
const { getBudget, updateBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').get(getBudget).put(updateBudget);

module.exports = router;
