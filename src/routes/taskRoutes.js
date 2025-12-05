const express = require('express');
const controleurTache = require('../controllers/taskController');
const { proteger, admin } = require('../middleware/authMiddleware');

const routeur = express.Router();

routeur.route('/')
    .get(proteger, controleurTache.obtenirTaches)
    .post(proteger, admin, controleurTache.creerTache);

routeur.route('/:id')
    .put(proteger, controleurTache.modifierTache); // Les membres peuvent mettre à jour le statut à 'doing' etc.

routeur.put('/:id/valider', proteger, admin, controleurTache.validerTache);

module.exports = routeur;
