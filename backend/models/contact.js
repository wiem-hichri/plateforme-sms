const db = require('../config/dbConnect').promise();

const Contact = {
    create: async (contact, userId) => {
        const query = `INSERT INTO contacts (matricule, nom, prenom, telephone_personnel, telephone_professionnel, site, service, cin) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [contact.matricule, contact.nom, contact.prenom, contact.telephone_personnel, contact.telephone_professionnel, contact.site, contact.service, contact.cin];

        const [result] = await db.query(query, values);
        const contactId = result.insertId;

        // 🔹 Associer automatiquement ce contact à l'utilisateur
        if (userId) {
            const associationQuery = `INSERT INTO user_contact (user_id, contact_id) VALUES (?, ?)`;
            await db.query(associationQuery, [userId, contactId]);
        }

        return result;
    },

    getAll: async () => {
        const [results] = await db.query("SELECT * FROM contacts");
        return results;
    },

    getByMatricule: async (matricule) => {
        const [results] = await db.query("SELECT * FROM contacts WHERE matricule = ?", [matricule]);
        return results.length > 0 ? results[0] : null;
    },

    update: async (id, contact) => {
        const query = `UPDATE contacts SET matricule=?, nom=?, prenom=?, telephone_personnel=?, telephone_professionnel=?, site=?, service=?, cin=? WHERE id=?`;
        const values = [contact.matricule, contact.nom, contact.prenom, contact.telephone_personnel, contact.telephone_professionnel, contact.site, contact.service, contact.cin, id];
        const [result] = await db.query(query, values);
        return result;
    },

    delete: async (id) => {
        const [result] = await db.query("DELETE FROM contacts WHERE id = ?", [id]);
        return result;
    },

    getByGroup: async (groupName) => {
        const query = "SELECT * FROM contacts WHERE service = ?";
        const [results] = await db.query(query, [groupName]);
        return results;
    },


    addMultipleContacts: async (contacts, callback) => {
        const query = `
          INSERT INTO contacts (matricule, nom, prenom, telephone_personnel, telephone_professionnel, service, cin, site) 
          VALUES ?
        `;
      
        const values = contacts.map(contact => [
          contact.matricule,
          contact.nom,
          contact.prenom,
          contact.telephone_personnel,
          contact.telephone_professionnel,
          contact.service,
          contact.cin,
          contact.site,
        ]);
      
        db.query(query, [values], callback);
      }




};

module.exports = Contact;
