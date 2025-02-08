const db = require('../config/dbConnect');

const Contact = {
    create: (contact) => {
        const query = `INSERT INTO contacts (matricule, nom, prenom, telephone_personnel, telephone_professionnel, site, role, cin) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [contact.matricule, contact.nom, contact.prenom, contact.telephone_personnel, contact.telephone_professionnel, contact.site, contact.role, contact.cin];
        return new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    getAll: () => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM contacts", (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },

    getById: (id) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM contacts WHERE id = ?", [id], (err, results) => {
                if (err) reject(err);
                else resolve(results.length > 0 ? results[0] : null);
            });
        });
    },

    update: (id, contact) => {
        const query = `UPDATE contacts SET matricule=?, nom=?, prenom=?, telephone_personnel=?, telephone_professionnel=?, site=?, role=?, cin=? WHERE id=?`;
        const values = [contact.matricule, contact.nom, contact.prenom, contact.telephone_personnel, contact.telephone_professionnel, contact.site, contact.role, contact.cin, id];
        return new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.query("DELETE FROM contacts WHERE id = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
};

module.exports = Contact;
