const db = require('../config/dbConnect').promise();

const Device = {
    create: async (device) => {
        const query = `INSERT INTO devices (nom, proprietaire, type) VALUES (?, ?, ?)`;
        const values = [device.nom, device.proprietaire, device.type];
        const [result] = await db.query(query, values);
        return result;
    },

    getAll: async () => {
        const [results] = await db.query("SELECT * FROM devices");
        return results;
    },

    update: async (id, device) => {
        const query = `UPDATE devices SET nom = ?, proprietaire = ?, type = ? WHERE id = ?`;
        const values = [device.nom, device.proprietaire,device.type, id];
        const [result] = await db.query(query, values);
        return result;
    },

    delete: async (id) => {
        const [result] = await db.query("DELETE FROM devices WHERE id = ?", [id]);
        return result;
    },
};

module.exports = Device;
