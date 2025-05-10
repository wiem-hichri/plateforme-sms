const db = require('../config/dbConnect').promise();

const Puce = {
    create: async (puce) => {
        // Modified to allow neither contact_id nor mission_id
        if (puce.contact_id && puce.mission_id) {
            throw new Error("You cannot provide both contact_id and mission_id.");
        }
        
        let contactIdValue = puce.contact_id || null;
        let missionIdValue = puce.mission_id || null;
        
        // If contact_id is 0, set it to null
        if (contactIdValue === 0) contactIdValue = null;
        
        // If mission_id is 0, set it to null
        if (missionIdValue === 0) missionIdValue = null;
      
        let query = `
          INSERT INTO sim_cards (numero, operateur, etat, quota, contact_id, mission_id, date_acquisition)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
      
        const values = [
          puce.numero,
          puce.operateur,
          puce.etat,
          puce.quota,
          contactIdValue,
          missionIdValue,
          puce.date_acquisition || new Date()
        ];
      
        const [result] = await db.query(query, values);
        return result;
    },
    
    getAllContacts: async () => {
        const [results] = await db.query("SELECT id, nom FROM contacts");
        return results;
    },

    getAllMissions: async () => {
        const [results] = await db.query("SELECT id, type_mission FROM missions");
        return results;
    },

    getAll: async () => {
        const [results] = await db.query("SELECT * FROM sim_cards ORDER BY date_acquisition DESC");
        return results;
    },

    getById: async (id) => {
        const [results] = await db.query("SELECT * FROM sim_cards WHERE id = ?", [id]);
        return results.length > 0 ? results[0] : null;
    },

    update: async (id, puce) => {
        // Modified to allow neither contact_id nor mission_id
        if (puce.contact_id && puce.mission_id) {
            throw new Error("You cannot provide both contact_id and mission_id.");
        }
        
        let contactIdValue = puce.contact_id || null;
        let missionIdValue = puce.mission_id || null;
        
        // If contact_id is 0, set it to null
        if (contactIdValue === 0) contactIdValue = null;
        
        // If mission_id is 0, set it to null
        if (missionIdValue === 0) missionIdValue = null;
      
        const query = `
          UPDATE sim_cards
          SET numero = ?, operateur = ?, etat = ?, quota = ?, contact_id = ?, mission_id = ?, date_acquisition = ?
          WHERE id = ?
        `;
      
        const values = [
          puce.numero,
          puce.operateur,
          puce.etat,
          puce.quota,
          contactIdValue,
          missionIdValue,
          puce.date_acquisition || new Date(),
          id
        ];
      
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
        const query = `UPDATE sim_cards SET contact_id = ?, mission_id = NULL WHERE id = ?`;
        const [result] = await db.query(query, [contactId, puceId]);
        return result;
    },

    assignPuceToMission: async (puceId, missionId) => {
        const query = `UPDATE sim_cards SET mission_id = ?, contact_id = NULL WHERE id = ?`;
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