const express = require('express');
const memberController = require('../controllers/memberController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, memberController.getMembers)
    .post(protect, admin, memberController.addMember);

router.route('/:id')
    .put(protect, admin, memberController.updateMember)
    .delete(protect, admin, memberController.removeMember);

module.exports = router;
