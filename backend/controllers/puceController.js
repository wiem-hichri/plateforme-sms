const Puce = require('../models/puce');

const createPuce = async (req, res) => {
    try {
        const puce = req.body;
        const result = await Puce.create(puce);
        res.status(201).json({ message: "Puce ajoutée avec succès", puceId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de la puce", error: error.message });
    }
};

const getPuces = async (req, res) => {
    try {
        const puces = await Puce.getAll();
        res.json({ status: "success", data: puces });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des puces", error: error.message });
    }
};

const getPuceById = async (req, res) => {
    try {
        const { id } = req.params;
        const puce = await Puce.getById(id);
        if (!puce) {
            return res.status(404).json({ message: "Puce non trouvée" });
        }
        res.status(200).json({ status: "success", data: puce });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la puce", error: error.message });
    }
};

const updatePuce = async (req, res) => {
    try {
        const { id } = req.params;
        const puceData = req.body;
        const result = await Puce.update(id, puceData);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Puce non trouvée" });
        }
        res.status(200).json({ message: "Puce mise à jour avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la puce", error: error.message });
    }
};

const deletePuce = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Puce.delete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Puce non trouvée" });
        }
        res.status(200).json({ message: "Puce supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la puce", error: error.message });
    }
};

const assignPuceToContact = async (req, res) => {
    try {
        const { puceId, contactId } = req.body;
        const result = await Puce.assignPuceToContact(puceId, contactId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Puce ou contact non trouvé" });
        }
        res.status(200).json({ message: "Puce affectée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'affectation de la puce", error: error.message });
    }
};

const assignPuceToMission = async (req, res) => {
    try {
        const { puceId, missionId } = req.body;
        const result = await Puce.assignPuceToMission(puceId, missionId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Puce ou mission non trouvé" });
        }
        res.status(200).json({ message: "Puce affectée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'affectation de la puce", error: error.message });
    }
};

const unassignPuceFromContact = async (req, res) => {
    try {
        const { puceId } = req.body;
        const result = await Puce.unassignPuceFromContact(puceId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Puce non trouvée" });
        }
        res.status(200).json({ message: "Puce dissociée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la dissociation de la puce", error: error.message });
    }
};

const unassignPuceFromMission = async (req, res) => {
    try {
        const { puceId } = req.body;
        const result = await Puce.unassignPuceFromMission(puceId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Puce non trouvée" });
        }
        res.status(200).json({ message: "Puce dissociée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la dissociation de la puce", error: error.message });
    }
};
const getContacts = async (req, res) => {
    try {
        const contacts = await Puce.getAllContacts();
        res.json({ status: "success", data: contacts });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des contacts', error: error.message });
    }
};

const getMissions = async (req, res) => {
    try {
        const missions = await Puce.getAllMissions();
        res.json({ status: "success", data: missions });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des missions', error: error.message });
    }
};


module.exports = {
    createPuce,
    getPuces,
    getPuceById,
    updatePuce,
    deletePuce,
    assignPuceToContact,
    assignPuceToMission,
    unassignPuceFromContact,
    unassignPuceFromMission,
    getContacts,
    getMissions
};
