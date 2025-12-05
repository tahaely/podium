const express = require('express');
const controleurMembre = require('../controllers/memberController');
const { proteger, admin } = require('../middleware/authMiddleware');

const routeur = express.Router();

routeur.route('/')
    .get(proteger, controleurMembre.obtenirMembres)
    .post(proteger, admin, controleurMembre.ajouterMembre);

routeur.route('/:id')
    .put(proteger, admin, controleurMembre.modifierMembre)
    .delete(proteger, admin, controleurMembre.supprimerMembre);

module.exports = routeur;
