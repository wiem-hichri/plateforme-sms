const db = require('../config/dbConnect').promise();
const bcrypt = require('bcrypt');
const crypto = require('crypto');



const generatePassword = () => {
    return crypto.randomBytes(6).toString('hex'); // Génère un mot de passe aléatoire de 12 caractères
};

const User = {
    create: async (user) => {
        try {
            const password = generatePassword(); // Génération automatique

            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 6); // Expiration du mot de passe dans 6 mois
            /*const expiryDate = new Date(); // Date actuelle
            expiryDate.setMinutes(expiryDate.getMinutes() + 3);*/     

            const query = `INSERT INTO users (matricule, nom, prenom, login, password, role, password_expiry) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const values = [user.matricule, user.nom, user.prenom, user.login, password, user.role, expiryDate];

            const [result] = await db.query(query, values);

            return { result, generatedPassword: password }; // Retourne le mot de passe généré en clair
        } catch (error) {
            throw new Error('Erreur lors de l\'ajout de l\'utilisateur : ' + error.message);
        }
    },

    verifyPassword: async (id, oldPassword) => {
        const query = `SELECT password FROM users WHERE id = ?`;
        const [user] = await db.query(query, [id]);

        if (user.length === 0) {
                throw new Error("Utilisateur non trouvé");
        }
    
        if (oldPassword !== user[0].password) {
                throw new Error("Ancien mot de passe incorrect");
        }
    
        return true;
    },
    
    updatePassword: async (id, newPassword) => {
        const newExpiryDate = new Date();
        newExpiryDate.setMonth(newExpiryDate.getMonth() + 6); // Le mot de passe expire dans 6 mois
    
        const query = `UPDATE users SET password=?, password_expiry=? WHERE id=?`;
        const values = [newPassword, newExpiryDate, id];
    
        const [result] = await db.query(query, values);
        return result;
    },

    getByLogin: async (login) => {
        const [results] = await db.query("SELECT * FROM users WHERE login = ?", [login]);
        return results.length > 0 ? results[0] : null;
    },

    updateLastLogin: async (id) => {
        const now = new Date();
        const query = `UPDATE users SET dernierLogin = ? WHERE id = ?`;
        const values = [now, id];
    
        const [result] = await db.query(query, values);
        return result;
    },
    
     getAll: async () => {
        const [results] = await db.query("SELECT * FROM users");
        return results;
    },

    getById: async (id) => {
        const [results] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        return results.length > 0 ? results[0] : null;
    },

    update: async (id, user) => {
        const query = `UPDATE users SET matricule=?, nom=?, prenom=?, login=?,  role=? WHERE id=?`;
        const values = [user.matricule, user.nom, user.prenom, user.login,  user.role, id];

        const [result] = await db.query(query, values);
        return result;
    },

    delete: async (id) => {
        const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
        return result;
    }
};

module.exports = User;
