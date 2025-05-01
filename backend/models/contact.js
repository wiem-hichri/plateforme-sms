const db = require('../config/dbConnect').promise();

const Contact = {
    create: async (contact, userId) => {
        const query = `INSERT INTO contacts (matricule, nom, prenom, telephone_personnel, telephone_professionnel, site, cin, fonction)
                       VALUES (?, ?, ?, ?, ?, ?, ? , ?)`;
        const values = [contact.matricule, contact.nom, contact.prenom, contact.telephone_personnel, contact.telephone_professionnel, contact.site, contact.cin, contact.fonction];

        const [result] = await db.query(query, values);
        const contactId = result.insertId;

        if (userId) {
            const associationQuery = `INSERT INTO user_contact (user_id, contact_id) VALUES (?, ?)`;
            await db.query(associationQuery, [userId, contactId]);
        }

        return { id: contactId, ...Contact };
    },

    getAll: async () => {
        const [results] = await db.query("SELECT * FROM contacts");
        return results;
    },

    getByMatricule: async (matricule) => {
        try {
            const [results] = await db.query("SELECT * FROM contacts WHERE matricule = ?", [matricule]);
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error("Erreur lors de la récupération du contact:", error);
            throw error;
        }
    },

    update: async (id, contact) => {
        const query = `UPDATE contacts SET matricule=?, nom=?, prenom=?, telephone_personnel=?, telephone_professionnel=?, site=?, cin=?, fonction=? WHERE id=?`;
        const values = [contact.matricule, contact.nom, contact.prenom, contact.telephone_personnel, contact.telephone_professionnel, contact.site, contact.cin, contact.fonction, id];
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

    getPhonesAndMatriculesByGroupId: async (groupId) => {
        const [rows] = await db.query(
            `SELECT c.telephone_professionnel, c.matricule
             FROM contacts c
             INNER JOIN contact_groupe cg ON c.id = cg.contact_id
             WHERE cg.groupe_id = ?`,
            [groupId]
        );
        return rows;
    },

    getPhonesByMatricules: async (matricules) => {
        if (!Array.isArray(matricules) || matricules.length === 0) {
            return [];
        }
    
        const placeholders = matricules.map(() => '?').join(', ');
        const [rows] = await db.query(
            `SELECT c.telephone_professionnel, c.matricule
             FROM contacts c
             WHERE c.matricule IN (${placeholders})`,
            matricules
        );
        return rows;
    },
    

    addMultipleContacts: async (contacts, callback) => {
        try {
            const [existingContacts] = await db.query("SELECT matricule FROM contacts");
            const existingMatricules = existingContacts.map(contact => contact.matricule);

            const newContacts = contacts.filter(contact => !existingMatricules.includes(contact.matricule));

            if (newContacts.length === 0) {
                return callback(null, { message: 'All contacts already exist.', importedCount: 0 });
            }

            const query = `
                INSERT INTO contacts (matricule, nom, prenom, telephone_personnel, telephone_professionnel, cin, site, fonction)
                VALUES ?`;

            const values = newContacts.map(contact => [
                contact.matricule,
                contact.nom,
                contact.prenom,
                contact.telephone_personnel,
                contact.telephone_professionnel,
                contact.cin,
                contact.site,
                contact.fonction

            ]);

            const [result] = await db.query(query, [values]);
            callback(null, { message: 'Contacts imported successfully', importedCount: result.affectedRows });
        } catch (error) {
            callback(error);
        }
    }
};

module.exports = Contact;
