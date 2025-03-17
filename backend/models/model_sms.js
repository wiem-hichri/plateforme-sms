const db = require('../config/dbConnect').promise();

const ModelSMS = {
    create: async ({ nom, contenu }) => {
        const query = `INSERT INTO model_sms (nom, contenu) VALUES (?, ?)`;
        const values = [nom, contenu];
        const [result] = await db.query(query, values);
        return result;
    },

    getAll: async () => {
        const [results] = await db.query("SELECT * FROM model_sms");
        return results;
    },

    getById: async (id) => {
        const [results] = await db.query("SELECT * FROM model_sms WHERE id = ?", [id]);
        return results.length > 0 ? results[0] : null;
    },

    update: async (id, { nom, contenu }) => {
        const query = `UPDATE model_sms SET nom=?, contenu=? WHERE id=?`;
        const values = [nom, contenu, id];
        const [result] = await db.query(query, values);
        return result;
    },

    delete: async (id) => {
        const [result] = await db.query("DELETE FROM model_sms WHERE id = ?", [id]);
        return result;
    },
};

module.exports = ModelSMS;
