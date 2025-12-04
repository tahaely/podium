const taskService = require('../services/taskService');

const createTask = async (req, res) => {
    try {
        const task = await taskService.createTask(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await taskService.updateTask(req.params.id, req.body);
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const uploadProof = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const proofUrl = `/uploads/${req.file.filename}`;
        const task = await taskService.uploadProof(req.params.id, proofUrl);
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const validateTask = async (req, res) => {
    try {
        const result = await taskService.validateTask(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTasks = async (req, res) => {
    try {
        const tasks = await taskService.getTasks(req.query);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTask, updateTask, uploadProof, validateTask, getTasks };
