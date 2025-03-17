const db = require('../config/dbConnect').promise();

const ModelVariable = {
    // Associer une variable à un modèle
    associateVariable: async (modelId, variableId) => {
        const query = `INSERT INTO model_variable (model_id, variable_id) VALUES (?, ?)`;
        const [result] = await db.query(query, [modelId, variableId]);
        return result;
    },

    // Récupérer les variables associées à un modèle
    getVariablesByModel: async (modelId) => {
        const query = `
            SELECT v.* FROM variable_sms v
            JOIN model_variable mv ON v.id = mv.variable_id
            WHERE mv.model_id = ?`;
        const [results] = await db.query(query, [modelId]);
        return results;
    },

    // Récupérer les modèles associés à une variable
    getModelsByVariable: async (variableId) => {
        const query = `
            SELECT m.* FROM model_sms m
            JOIN model_variable mv ON m.id = mv.model_id
            WHERE mv.variable_id = ?`;
        const [results] = await db.query(query, [variableId]);
        return results;
    },

    // Supprimer une association entre un modèle et une variable
    deleteAssociation: async (modelId, variableId) => {
        const query = `DELETE FROM model_variable WHERE model_id = ? AND variable_id = ?`;
        const [result] = await db.query(query, [modelId, variableId]);
        return result;
    }
};

module.exports = ModelVariable;
