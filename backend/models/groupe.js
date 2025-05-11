const db = require('../config/dbConnect').promise();

const Groupe = {
    // Create a new group for a specific user
    create: async (nom, userId) => {
        const query = "INSERT INTO groupes (nom) VALUES (?)";
        const values = [nom];
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            throw new Error("Échec de la création du groupe.");
        }

        const groupId = result.insertId;

        // Associate group with the user
        await db.query("INSERT INTO user_groupe (user_id, groupe_id) VALUES (?, ?)", [userId, groupId]);

        return { id: groupId, nom };
    },

    // Get all groups for a specific user or all groups for super-administrateur
    getAll: async (userId, role) => {
        let query = `
          SELECT 
            g.id, 
            g.nom, 
            u.id AS createur_id,
            u.nom AS createur_nom,
            u.prenom AS createur_prenom
          FROM groupes g
          LEFT JOIN user_groupe ug ON g.id = ug.groupe_id
          LEFT JOIN users u ON ug.user_id = u.id
        `;
      
        const values = [];
      
        if (role !== 'super-administrateur') {
          query += `
            WHERE ug.user_id = ?
          `;
          values.push(userId);
        }
      
        query += ` ORDER BY g.created_at DESC`;
      
        const [results] = await db.query(query, values);
        return results;
      },
      
      
    

    // Get a group by ID and user
    getByIdAndUser: async (id, userId) => {
        const [results] = await db.query("SELECT g.* FROM groupes g JOIN user_groupe ug ON g.id = ug.groupe_id WHERE g.id = ? AND ug.user_id = ?", [id, userId]);
        return results.length > 0 ? results[0] : null;
    },

    // Update a group for a specific user
    update: async (id, nom) => {
        const query = "UPDATE groupes SET nom=? WHERE id=?";
        const values = [nom, id];
        const [result] = await db.query(query, values);
        return result;
    },

    // Delete a group for a specific user
    delete: async (id) => {
        await db.query("DELETE FROM user_groupe WHERE groupe_id = ?", [id]); // Remove user association first
        const [result] = await db.query("DELETE FROM groupes WHERE id = ?", [id]);
        return result;
    }
};

module.exports = Groupe;
