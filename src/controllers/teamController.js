const teamService = require('../services/teamService');

const createTeam = async (req, res) => {
    try {
        const { name, color } = req.body;
        const team = await teamService.createTeam(name, color);
        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTeams = async (req, res) => {
    try {
        const teams = await teamService.getAllTeams();
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTeam = async (req, res) => {
    try {
        const team = await teamService.getTeamById(req.params.id);
        if (!team) return res.status(404).json({ message: 'Team not found' });
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTeam = async (req, res) => {
    try {
        const { name, color } = req.body;
        const team = await teamService.updateTeam(req.params.id, name, color);
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTeam = async (req, res) => {
    try {
        await teamService.deleteTeam(req.params.id);
        res.json({ message: 'Team removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTeam, getTeams, getTeam, updateTeam, deleteTeam };
