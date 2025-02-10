const db = require('../config/dbConnect').promise();

const Contact = {
    create: async (contact) => {
        const query = `INSERT INTO contacts (matricule, nom, prenom, telephone_personnel, telephone_professionnel, site, service, cin) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [contact.matricule, contact.nom, contact.prenom, contact.telephone_personnel, contact.telephone_professionnel, contact.site, contact.service, contact.cin];
        const [result] = await db.query(query, values);
        return result;
    },

    getAll: async () => {
        const [results] = await db.query("SELECT * FROM contacts");
        return results;
    },

    getById: async (id) => {
        const [results] = await db.query("SELECT * FROM contacts WHERE id = ?", [id]);
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
    }
};

module.exports = Contact;
