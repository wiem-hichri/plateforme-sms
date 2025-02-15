const User = require('../models/user');
const db = require('../config/dbConnect').promise();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createUser = async (req, res) => {
    try {
        const user = req.body;
        const result = await User.create(user);
        res.status(201).json({ message: 'User créé avec succès', userId: result.insertId });
        } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du User', error: error.message });
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

const login = async (req, res) => {
    try {
        const { login, password } = req.body;

        const [user] = await db.query("SELECT * FROM users WHERE login = ?", [login]);
        if (user.length === 0) {
            return res.status(400).json({ message: "login incorrect" });
        }

        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        const token = jwt.sign(
            { id: user[0].id, role: user[0].role }, 
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Connexion réussie", token });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, login };
