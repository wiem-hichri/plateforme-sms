const db = require('../config/dbConnect').promise();
const bcrypt = require('bcrypt');

const User = {
    create: async (user) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);

            const query = `INSERT INTO users (matricule, nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?, ?)`;
            const values = [user.matricule, user.nom, user.prenom, user.email, hashedPassword, user.role];

            const [result] = await db.query(query, values);
            return result;
        } catch (error) {
            throw new Error('Erreur lors du hachage du mot de passe : ' + error.message);
        }
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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        const query = `UPDATE users SET matricule=?, nom=?, prenom=?, email=?, password=?, role=? WHERE id=?`;
        const values = [user.matricule, user.nom, user.prenom, user.email, hashedPassword, user.role, id];

        const [result] = await db.query(query, values);
        return result;
    },

    delete: async (id) => {
        const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
        return result;
    }
};

module.exports = User;
