const db = require('../config/dbConnect').promise();

const Groupe = {
    create: async (nom, userId) => {
        const query = `INSERT INTO groupes (nom) VALUES (?)`;
        const [result] = await db.query(query, [nom]);
        
        if (result.affectedRows === 0) {
            throw new Error("Échec de la création du groupe.");
        }

        const groupId = result.insertId;

        // ✅ Associate group with the user
        await db.query(`INSERT INTO user_groupe (user_id, groupe_id) VALUES (?, ?)`, [userId, groupId]);

        return { id: groupId, nom };
    },

    getAll: async () => {
        const [results] = await db.query(`
            SELECT g.id, g.nom, ug.user_id 
            FROM groupes g
            LEFT JOIN user_groupe ug ON g.id = ug.groupe_id
        `);
        return results;
    },

    getById: async (id) => {
        const [results] = await db.query("SELECT * FROM groupes WHERE id = ?", [id]);
        return results.length > 0 ? results[0] : null;
    },

    update: async (id, nom) => {
        const query = `UPDATE groupes SET nom=? WHERE id=?`;
        const [result] = await db.query(query, [nom, id]);
        return result;
    },

    delete: async (id) => {
        await db.query("DELETE FROM user_groupe WHERE groupe_id = ?", [id]); // ✅ Remove user association first
        const [result] = await db.query("DELETE FROM groupes WHERE id = ?", [id]);
        return result;
    },
};

module.exports = Groupe;
