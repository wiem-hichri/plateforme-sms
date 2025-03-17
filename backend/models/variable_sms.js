const db = require('../config/dbConnect').promise();

const VariableSMS = {
    create: async ({ nom_variable }) => {
        const query = `INSERT INTO variable_sms (nom_variable) VALUES (?)`;
        const values = [nom_variable];
        const [result] = await db.query(query, values);
        return result;
    },

    getAll: async () => {
        const [results] = await db.query("SELECT * FROM variable_sms");
        return results;
    },

    delete: async (id) => {
        const [result] = await db.query("DELETE FROM variable_sms WHERE id = ?", [id]);
        return result;
    },
};

module.exports = VariableSMS;
