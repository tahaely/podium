const express = require('express');
const controleurEquipe = require('../controllers/teamController');
const { proteger, admin } = require('../middleware/authMiddleware');

const routeur = express.Router();

routeur.route('/')
    .get(proteger, controleurEquipe.obtenirEquipes)
    .post(proteger, admin, controleurEquipe.creerEquipe);

routeur.route('/:id')
    .get(proteger, controleurEquipe.obtenirEquipe)
    .put(proteger, admin, controleurEquipe.modifierEquipe)
    .delete(proteger, admin, controleurEquipe.supprimerEquipe);

module.exports = routeur;
