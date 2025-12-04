const express = require('express');
const taskController = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

router.route('/')
    .get(protect, taskController.getTasks)
    .post(protect, admin, taskController.createTask);

router.route('/:id')
    .put(protect, taskController.updateTask); // Members can update status to 'doing' etc.

router.post('/:id/proof', protect, upload.single('proof'), taskController.uploadProof);

router.put('/:id/validate', protect, admin, taskController.validateTask);

module.exports = router;
