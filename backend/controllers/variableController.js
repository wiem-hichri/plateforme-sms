const VariableSMS = require('../models/variable_sms');

const createVariable = async (req, res) => {
    try {
        const { nom_variable } = req.body;
        const result = await VariableSMS.create({ nom_variable });
        res.status(201).json({ message: "Variable ajoutée avec succès.", variableId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllVariables = async (req, res) => {
    try {
        const variables = await VariableSMS.getAll();
        res.json({ status: "success", data: variables });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des variables", error: error.message });
    }
};

const deleteVariable = async (req, res) => {
    try {
        const variableId = req.params.id;
        const result = await VariableSMS.delete(variableId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Variable non trouvée" });
        }
        res.status(200).json({ message: "Variable supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la variable", error: error.message });
    }
};

module.exports = { createVariable, getAllVariables, deleteVariable };
