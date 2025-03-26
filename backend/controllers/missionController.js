const Mission = require('../models/mission');

const createMission = async (req, res) => {
    try {
        const { type_mission } = req.body;
        const mission = { type_mission };
        const result = await Mission.create(mission);
        res.status(201).json({ message: "Mission créée avec succès", missionId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la mission', error: error.message });
    }
};

const getMissions = async (req, res) => {
    try {
        const missions = await Mission.getAll();
        res.json({
            status: "success",
            data: missions,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des missions', error: error.message });
    }
};

const getMissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const mission = await Mission.getById(id);

        if (!mission) {
            return res.status(404).json({ message: "Mission non trouvée" });
        }

        res.json({
            status: "success",
            data: mission,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la mission', error: error.message });
    }
};

const updateMission = async (req, res) => {
    try {
        const missionId = req.params.id;
        const { type_mission } = req.body;
        const mission = { type_mission };
        const result = await Mission.update(missionId, mission);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Mission non trouvée' });
        }

        res.status(200).json({ message: 'Mission mise à jour avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la mission', error: error.message });
    }
};

const deleteMission = async (req, res) => {
    try {
        const missionId = req.params.id;
        const result = await Mission.delete(missionId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Mission non trouvée' });
        }

        res.status(200).json({ message: 'Mission supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la mission', error: error.message });
    }
};

module.exports = { createMission, getMissions, getMissionById, updateMission, deleteMission };
