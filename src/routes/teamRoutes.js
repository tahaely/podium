const express = require('express');
const teamController = require('../controllers/teamController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, teamController.getTeams)
    .post(protect, admin, teamController.createTeam);

router.route('/:id')
    .get(protect, teamController.getTeam)
    .put(protect, admin, teamController.updateTeam)
    .delete(protect, admin, teamController.deleteTeam);

module.exports = router;
