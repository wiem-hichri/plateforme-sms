const SMS = require('../models/sms'); // assuming the model is in models/sms.js

const smsCount = async (req, res) => {
    try {
        const [rows] = await SMS.smsCount();
        res.json({ status: 'success', count: rows[0].count });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du nombre de messages", error: error.message });
    }
};

const insertSMS = async (req, res) => {
    const { destinationNumber, textDecoded, creatorId } = req.body;
    
    if (!destinationNumber || !textDecoded || !creatorId) {
        return res.status(400).json({ message: 'Données manquantes' });
    }

    try {
        await SMS.insertSMS(destinationNumber, textDecoded, creatorId);
        res.status(201).json({ message: 'MessageOK' });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du message", error: error.message });
    }
};

const getSMS = async (req, res) => {
    try {
        const [rows] = await SMS.getSMS();
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Aucun message dans la boîte d\'envoi' });
        }
        res.status(200).json({ status: 'success', message: rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du prochain message", error: error.message });
    }
};

const deleteSMS = async (req, res) => {
    try {
        await SMS.deleteSMS();
        res.status(200).json({ message: 'Message supprimé avec succès de la boîte d\'envoi' });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du message", error: error.message });
    }
};

const smsSent = async (req, res) => {
    try {
        const message = await SMS.smsSent();
        res.status(200).json({ message: 'Dernier message transféré vers les éléments envoyés et supprimé de la boîte d\'envoi', data: message });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'insertion du dernier message dans les éléments envoyés", error: error.message });
    }
};

module.exports = {
    smsCount,
    insertSMS,
    getSMS,
    deleteSMS,
    smsSent
};
