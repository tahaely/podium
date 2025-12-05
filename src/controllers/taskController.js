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
        const updates = { ...req.body };

        // If status is changing to 'doing', assign the current user
        if (updates.status === 'doing' && req.user && req.user.id) {
            // We need to get the member_id associated with this user
            // This assumes the user is a member. Ideally, we should look up the member_id.
            // However, looking at the schema, members table links user_id.
            // Let's pass the user_id to the service to handle the lookup or pass member_id if available in token.
            // The token has { id, email, role }. It doesn't seem to have member_id directly.
            // But let's check authService/login again.
            // Login stores: { id: response.data.id ... } which is the USER id.
            // So we need to find the member_id for this user_id.

            // Actually, let's look at how we can get the member_id.
            // The service layer might be a better place for this logic if we need a DB lookup.
            // Let's pass the user_id to the service.
            updates.user_id = req.user.id;
        }

        const task = await taskService.updateTask(req.params.id, updates);
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
