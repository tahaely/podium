const express = require('express');
const leaderboardController = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, leaderboardController.getLeaderboard);

module.exports = router;
