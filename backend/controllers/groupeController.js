const Groupe = require('../models/groupe');

const createGroupe = async (req, res) => {
    try {
        const { userId, nom } = req.body; // ✅ Ensure correct extraction of 'nom'

        if (!userId) {
            return res.status(400).json({ error: "L'ID utilisateur est requis." });
        }

        const newGroupe = await Groupe.create(nom, userId);
        res.status(201).json({ message: "Groupe créé avec succès.", data: newGroupe });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getGroupes = async (req, res) => {
    try {
        const groupes = await Groupe.getAll();
        res.json({ status: "Success", data: groupes });

    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des groupes', error: error.message });
    }
};

const getGroupeById = async (req, res) => {
    try {
        const groupeId = req.params.id;
        const groupe = await Groupe.getById(groupeId);
        if (!groupe) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }
        res.json({ status: "Success", data: groupe });

    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du groupe', error: error.message });
    }
};

const updateGroupe = async (req, res) => {
    try {
        const groupeId = req.params.id;
        const { nom } = req.body;
        const result = await Groupe.update(groupeId, nom);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }

        res.status(200).json({ message: 'Groupe mis à jour avec succès' });

    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du groupe', error: error.message });
    }
};

const deleteGroupe = async (req, res) => {
    try {
        const groupeId = req.params.id;
        const result = await Groupe.delete(groupeId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }

        res.status(200).json({ message: 'Groupe supprimé avec succès' });

    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du groupe', error: error.message });
    }
};

module.exports = { createGroupe, getGroupes, getGroupeById, updateGroupe, deleteGroupe };
