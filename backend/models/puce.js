const db = require('../config/dbConnect').promise();

const Puce = {
    create: async (puce) => {
        if ((puce.contact_id && puce.mission_id) || (!puce.contact_id && !puce.mission_id)) {
          throw new Error("You must provide either contact_id or mission_id, but not both.");
        }
      
        let query = `
          INSERT INTO sim_cards (numero, operateur, etat, quota, ${puce.contact_id ? 'contact_id' : 'mission_id'}, date_acquisition)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
      
        const values = [
          puce.numero,
          puce.operateur,
          puce.etat,
          puce.quota,
          puce.contact_id || puce.mission_id,
          puce.date_acquisition
        ];
      
        const [result] = await db.query(query, values);
        return result;
      }
      ,getAllContacts: async () => {
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
        if ((puce.contact_id && puce.mission_id) || (!puce.contact_id && !puce.mission_id)) {
          throw new Error("You must provide either contact_id or mission_id, but not both.");
        }
      
        // Build the SET clause dynamically
        const targetField = puce.contact_id ? 'contact_id' : 'mission_id';
        const targetValue = puce.contact_id || puce.mission_id;
      
        const query = `
          UPDATE sim_cards
          SET numero = ?, operateur = ?, etat = ?, quota = ?, date_acquisition = ?, ${targetField} = ?, ${puce.contact_id ? 'mission_id' : 'contact_id'} = NULL
          WHERE id = ?
        `;
      
        const values = [
          puce.numero,
          puce.operateur,
          puce.etat,
          puce.quota,
          puce.date_acquisition,
          targetValue,
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
