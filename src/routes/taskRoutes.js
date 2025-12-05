const express = require('express');
const taskController = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, taskController.getTasks)
    .post(protect, admin, taskController.createTask);

router.route('/:id')
    .put(protect, taskController.updateTask); // Members can update status to 'doing' etc.

router.put('/:id/validate', protect, admin, taskController.validateTask);

module.exports = router;
