const db = require('../config/dbConnect').promise();

const Puce = {
    create: async (puce) => {
        const query = `INSERT INTO sim_cards (numero, operateur, etat, quota, date_acquisition)
                       VALUES (?, ?, ?, ?, ?)`;
        const values = [puce.numero, puce.operateur, puce.etat, puce.quota, puce.date_acquisition];

        const [result] = await db.query(query, values);
        return result;
    },getAllContacts: async () => {
        const [results] = await db.query("SELECT id, nom FROM contacts");
        return results;
    },

    getAllMissions: async () => {
        const [results] = await db.query("SELECT id, type_mission FROM missions");
        return results;
    },

    getAll: async () => {
        const [results] = await db.query("SELECT * FROM sim_cards");
        return results;
    },

    getById: async (id) => {
        const [results] = await db.query("SELECT * FROM sim_cards WHERE id = ?", [id]);
        return results.length > 0 ? results[0] : null;
    },

    update: async (id, puce) => {
        const query = `UPDATE sim_cards SET numero = ?, operateur = ?, etat = ?, quota = ?, date_acquisition = ?
                       WHERE id = ?`;
        const values = [puce.numero, puce.operateur, puce.etat, puce.quota, puce.date_acquisition, id];
        const [result] = await db.query(query, values);
        return result;
    },

    delete: async (id) => {
        const [result] = await db.query("DELETE FROM sim_cards WHERE id = ?", [id]);
        return result;
    },

    getByContactId: async (contactId) => {
        const query = `SELECT * FROM sim_cards WHERE contact_id = ?`;
        const [results] = await db.query(query, [contactId]);
        return results;
    },

    assignPuceToContact: async (puceId, contactId) => {
        const query = `UPDATE sim_cards SET contact_id = ? WHERE id = ?`;
        const [result] = await db.query(query, [contactId, puceId]);
        return result;
    },

    assignPuceToMission: async (puceId, missionId) => {
        const query = `UPDATE sim_cards SET mission_id = ? WHERE id = ?`;
        const [result] = await db.query(query, [missionId, puceId]);
        return result;
    },

    unassignPuceFromContact: async (puceId) => {
        const query = `UPDATE sim_cards SET contact_id = NULL WHERE id = ?`;
        const [result] = await db.query(query, [puceId]);
        return result;
    },

    unassignPuceFromMission: async (puceId) => {
        const query = `UPDATE sim_cards SET mission_id = NULL WHERE id = ?`;
        const [result] = await db.query(query, [puceId]);
        return result;
    },
};

module.exports = Puce;
