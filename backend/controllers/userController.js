const User = require('../models/user');
const db = require('../config/dbConnect').promise();
require('dotenv').config();

const createUser = async (req, res) => {
    try {
        const user = req.body;
        const { result, generatedPassword } = await User.create(user);

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            userId: result.insertId,
            generatedPassword: generatedPassword // On envoie le mot de passe pour que l’admin puisse le transmettre
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du User', error: error.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // Vérifier l'ancien mot de passe
        await User.verifyPassword(userId, oldPassword);

        // Vérifier la correspondance entre newPassword et confirmPassword
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Les nouveaux mots de passe ne correspondent pas" });
        }

        // Mettre à jour le mot de passe dans la base de données
        const result = await User.updatePassword(userId, newPassword);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du mot de passe", error: error.message });
    }
};


const getUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des users', error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.getById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User non trouvé' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du user', error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const newUserData = req.body;
        const result = await User.update(userId, newUserData);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User non trouvé' });
        }
        res.status(200).json({ message: 'User mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du user', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await User.delete(userId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User non trouvé' });
        }
        res.status(200).json({ message: 'User supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du user', error: error.message });
    }
};

const getAllLoginHistory = async (req, res) => {
    try {
        const [history] = await db.query(
            `SELECT lh.id, lh.user_id, u.nom, u.prenom, u.login, lh.ip_address, lh.user_agent, lh.login_time 
             FROM login_history lh 
             JOIN users u ON lh.user_id = u.id 
             ORDER BY lh.login_time DESC`
        );

        console.log("Login History Data:", history); // Debugging log
        res.json(history);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'historique :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
module.exports = { createUser,updatePassword, getUsers, getUserById, updateUser, deleteUser, getAllLoginHistory };
