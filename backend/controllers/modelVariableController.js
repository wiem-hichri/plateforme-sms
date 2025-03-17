const ModelVariable = require('../models/modelVariable');

const associateVariable = async (req, res) => {
    try {
        const { modelId, variableId } = req.body;
        await ModelVariable.associateVariable(modelId, variableId);
        res.status(201).json({ message: "Variable associée au modèle avec succès." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getVariablesByModel = async (req, res) => {
    try {
        const modelId = req.params.modelId;
        const variables = await ModelVariable.getVariablesByModel(modelId);
        res.json({ status: "success", data: variables });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getModelsByVariable = async (req, res) => {
    try {
        const variableId = req.params.variableId;
        const models = await ModelVariable.getModelsByVariable(variableId);
        res.json({ status: "success", data: models });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAssociation = async (req, res) => {
    try {
        const { modelId, variableId } = req.body;
        await ModelVariable.deleteAssociation(modelId, variableId);
        res.json({ message: "Association supprimée avec succès." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { associateVariable, getVariablesByModel, getModelsByVariable, deleteAssociation };
