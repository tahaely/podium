const express = require('express');
const controleurClassement = require('../controllers/leaderboardController');
const { proteger } = require('../middleware/authMiddleware');

const routeur = express.Router();

routeur.get('/', proteger, controleurClassement.obtenirClassement);

module.exports = routeur;
