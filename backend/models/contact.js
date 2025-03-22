const db = require('../config/dbConnect').promise();

const Contact = {
    create: async (contact, userId) => {
        const query = `INSERT INTO contacts (matricule, nom, prenom, telephone_personnel, telephone_professionnel, site, service, cin)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [contact.matricule, contact.nom, contact.prenom, contact.telephone_personnel, contact.telephone_professionnel, contact.site, contact.service, contact.cin];

        const [result] = await db.query(query, values);
        const contactId = result.insertId;

        // Associate the contact with the user
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
        try {
            const [results] = await db.query("SELECT * FROM contacts WHERE matricule = ?", [matricule]);
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error("Erreur lors de la récupération du contact:", error);
            throw error;
        }
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
        try {
            // Fetch existing matricules from the database
            const [existingContacts] = await db.query("SELECT matricule FROM contacts");
            const existingMatricules = existingContacts.map(contact => contact.matricule);

            // Filter out contacts that already exist
            const newContacts = contacts.filter(contact => !existingMatricules.includes(contact.matricule));

            if (newContacts.length === 0) {
                return callback(null, { message: 'All contacts already exist.', importedCount: 0 });
            }

            // Insert new contacts into the database
            const query = `
                INSERT INTO contacts (matricule, nom, prenom, telephone_personnel, telephone_professionnel, service, cin, site)
                VALUES ?
            `;

            const values = newContacts.map(contact => [
                contact.matricule,
                contact.nom,
                contact.prenom,
                contact.telephone_personnel,
                contact.telephone_professionnel,
                contact.service,
                contact.cin,
                contact.site,
            ]);

            const [result] = await db.query(query, [values]);
            callback(null, { message: 'Contacts imported successfully', importedCount: result.affectedRows });
        } catch (error) {
            callback(error);
        }
    }
};

module.exports = Contact;
