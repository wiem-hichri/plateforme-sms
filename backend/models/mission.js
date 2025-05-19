const db = require('../config/dbConnect').promise();

const Mission = {
    create: async (mission) => {
        const query = `INSERT INTO missions (type_mission) VALUES ( ?)`;
        const values = [mission.type_mission];

        const [result] = await db.query(query, values);
        return result;
    },

    getAll: async () => {
        const [results] = await db.query("SELECT * FROM missions");
        return results;
    },

    getById: async (id) => {
        const [results] = await db.query("SELECT * FROM missions WHERE id = ?", [id]);
        return results.length > 0 ? results[0] : null;
    },

    update: async (id, mission) => {
        const query = `UPDATE missions SET type_mission = ? WHERE id = ?`;
        const values = [mission.type_mission, id];
        const [result] = await db.query(query, values);
        return result;
    },

    delete: async (id) => {
        const [result] = await db.query("DELETE FROM missions WHERE id = ?", [id]);
        return result;
    },
};

module.exports = Mission;
