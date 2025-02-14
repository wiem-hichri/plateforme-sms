const db = require('../config/dbConnect').promise();

const Groupe = {
    create: async (groupe) => {
        const query = `INSERT INTO groupes (nom) VALUES (?)`;
        const values = [groupe.nom];
        const [result] = await db.query(query, values);
        return result;
    },

    getAll: async () => {
        const [results] = await db.query("SELECT * FROM groupes");
        return results;
    },

    getById: async (id) => {
        const [results] = await db.query("SELECT * FROM groupes WHERE id = ?", [id]);
        return results.length > 0 ? results[0] : null;
    },

    update: async (id, groupe) => {
        const query = `UPDATE groupes SET nom=? WHERE id=?`;
        const values = [groupe.nom, id];
        const [result] = await db.query(query, values);
        return result;
    },

    delete: async (id) => {
        const [result] = await db.query("DELETE FROM groupes WHERE id = ?", [id]);
        return result;
    },
};

module.exports = Groupe;
