const SMS = require('../models/sms');

const smsCount = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
        const [rows] = await SMS.smsCount();
        res.json({ status: 'success', count: rows[0].count });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du nombre de messages", error: error.message });
    }
};

const insertSMS = async (req, res) => {
    try {
        const { destinationNumber, textDecoded,modeleId } = req.body;

        if (!destinationNumber || !textDecoded ) {
            return res.status(400).json({ message: 'Données manquantes' });
        }
        const senderID = req.session.user.id;
        await SMS.insertSMS(destinationNumber, textDecoded, senderID, modeleId || null);

        res.status(201).json({ message: 'Message ajouté avec succès' });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du message", error: error.message });
    }
};

const getSMSFloat = async (req, res) => {
    try {
        const [rows] = await SMS.getSMSFloat();
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Aucun message float dans la boîte d\'envoi' });
        }
        res.status(200).json({ status: 'success', message: rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du prochain message", status: error.message });
    }
};

const getSMSORFloat = async (req, res) => {
    try {
        const [rows] = await SMS.getSMSORFloat();
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Aucun message ORfloat dans la boîte d\'envoi' });
        }
        res.status(200).json({ status: 'success', message: rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du prochain message", status: error.message });
    }
};

const deleteSMS = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'ID de message manquant' });
        }
        await SMS.deleteSMS(id);
        res.status(200).json({ message: 'Message supprimé avec succès de la boîte d\'envoi' });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du message", error: error.message });
    }
};

// Updated to add debugging and ensure consistent status handling
const smsSent = async (req, res) => {
    try {
        const { status, deviceName, messageId } = req.body;
        
        console.log('Received status update:', req.body);

        if (!status || !messageId) {
            return res.status(400).json({ 
                message: 'Données manquantes. Statut et ID du message requis.'
            });
        }

        // Debug received data
        console.log(`Processing status update: status=${status}, device=${deviceName}, id=${messageId}`);
        
        const message = await SMS.smsSent(status, deviceName, messageId);

        // Make response consistent regardless of status
        res.status(200).json({ 
            status: 'success',
            message: status === 'success' 
                ? 'Message transféré vers les éléments envoyés et supprimé de la boîte d\'envoi'
                : 'Le message reste dans la boîte d\'envoi pour une nouvelle tentative',
            data: message 
        });
    } catch (error) {
        console.error('Error in smsSent controller:', error);
        res.status(500).json({ 
            status: 'error',
            message: "Erreur lors du traitement du statut d'envoi", 
            error: error.message 
        });
    }
};

module.exports = {
    smsCount,
    insertSMS,
    getSMSFloat,
    getSMSORFloat,
    deleteSMS,
    smsSent
};