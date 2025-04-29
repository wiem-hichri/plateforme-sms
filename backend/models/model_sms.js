const db = require('../config/dbConnect').promise();

const ModelSMS = {
    // Créer un modèle de SMS pour un utilisateur spécifique
    create: async ({ user_id, nom, contenu }) => {
        const query = `INSERT INTO model_sms (user_id, nom, contenu) VALUES (?, ?, ?)`;
        const values = [user_id, nom, contenu];
        const [result] = await db.query(query, values);
        return result;
    },

    // Récupérer tous les modèles de SMS d'un utilisateur spécifique
    getAllByUser: async (user_id) => {
        const [results] = await db.query("SELECT * FROM model_sms WHERE user_id = ?", [user_id]);
        return results;
    },
    
       // Récupérer tous les modèles de SMS (pour le superadmin) ou les modèles d'un utilisateur spécifique
        getAll: async (user_id, role) => {
            let query = "SELECT * FROM model_sms";
            let values = [];

            if (role !== 'super-administrateur') {
                query += " WHERE user_id = ?";
                values.push(user_id);
            }

            const [results] = await db.query(query, values);
            return results;
        },

    // Récupérer un modèle de SMS par son ID et son utilisateur
    getByIdAndUser: async (id, user_id) => {
        const [results] = await db.query("SELECT * FROM model_sms WHERE id = ? AND user_id = ?", [id, user_id]);
        return results.length > 0 ? results[0] : null;
    },
    getById: async (id) => {
        const [results] = await db.query("SELECT * FROM model_sms WHERE id = ?", [id]);
        return results.length > 0 ? results[0] : null;
    },
    // Mettre à jour un modèle de SMS pour un utilisateur spécifique
    update: async (id, user_id, { nom, contenu }) => {
        const query = `UPDATE model_sms SET nom=?, contenu=? WHERE id=? AND user_id=?`;
        const values = [nom, contenu, id, user_id];
        const [result] = await db.query(query, values);
        return result;
    },

    // Supprimer un modèle de SMS pour un utilisateur spécifique
    delete: async (id, user_id) => {
        const [result] = await db.query("DELETE FROM model_sms WHERE id = ? AND user_id = ?", [id, user_id]);
        return result;
    },
};

module.exports = ModelSMS;