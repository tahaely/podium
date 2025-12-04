const leaderboardService = require('../services/leaderboardService');

const getLeaderboard = async (req, res) => {
    try {
        const { period } = req.query; // daily, weekly, total (default)
        const leaderboard = await leaderboardService.getLeaderboard(period);
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getLeaderboard };
