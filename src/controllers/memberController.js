const memberService = require('../services/memberService');

const addMember = async (req, res) => {
    try {
        const { team_id, user_id, name, role, avatar_url } = req.body;
        const member = await memberService.addMember(team_id, user_id, name, role, avatar_url);
        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeMember = async (req, res) => {
    try {
        await memberService.removeMember(req.params.id);
        res.json({ message: 'Member removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMember = async (req, res) => {
    try {
        const { name, role, avatar_url } = req.body;
        const member = await memberService.updateMember(req.params.id, name, role, avatar_url);
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMembers = async (req, res) => {
    try {
        const { team_id } = req.query;
        const members = await memberService.getAllMembers(team_id);
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addMember, removeMember, updateMember, getMembers };
