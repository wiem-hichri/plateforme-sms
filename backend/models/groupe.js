const db = require('../config/dbConnect');

const Groupe = {
    create: (groupe) => {
        const query = `INSERT INTO groupes (nom) 
                       VALUES (?)`;
        const values = [groupe.nom];
        return new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    getAll: () => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM groupes", (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },

    getById: (id) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM groupes WHERE id = ?", [id], (err, results) => {
                if (err) reject(err);
                else resolve(results.length > 0 ? results[0] : null);
            });
        });
    },

    update: (id, groupe) => {
        const query = `UPDATE groupes SET  nom=? WHERE id=?`;
        const values = [groupe.nom, id];
        return new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.query("DELETE FROM groupes WHERE id = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

}

module.exports = Groupe;
