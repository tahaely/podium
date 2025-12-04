const authService = require('../services/authService');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;

    try {
        const user = await authService.register(email, password, role);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const data = await authService.login(email, password);
        res.json(data);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

module.exports = { register, login };
