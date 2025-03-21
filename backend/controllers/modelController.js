const Contact = require('../models/contact');
const ContactGroupe = require('../models/contactGroupe');
const ModeleSMS = require('../models/model_sms');
const xlsx = require('xlsx');
const db = require('../config/dbConnect').promise();



const createModel = async (req, res) => {
    try {
        const { nom, contenu } = req.body;
        const result = await ModelSMS.create({ nom, contenu });
        res.status(201).json({ message: "Modèle ajouté avec succès.", modelId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllModels = async (req, res) => {
    try {
        const models = await ModelSMS.getAll();
        res.json({ status: "success", data: models });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des modèles", error: error.message });
    }
};

const getModelById = async (req, res) => {
    try {
        const modelId = req.params.id;
        const model = await ModelSMS.getById(modelId);
        if (!model) {
            return res.status(404).json({ message: "Modèle non trouvé" });
        }
        res.json({ status: "success", data: model });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du modèle", error: error.message });
    }
};

const updateModel = async (req, res) => {
    try {
        const modelId = req.params.id;
        const newData = req.body;
        const result = await ModelSMS.update(modelId, newData);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Modèle non trouvé" });
        }
        res.status(200).json({ message: "Modèle mis à jour avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du modèle", error: error.message });
    }
};

const deleteModel = async (req, res) => {
    try {
        const modelId = req.params.id;
        const result = await ModelSMS.delete(modelId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Modèle non trouvé" });
        }
        res.status(200).json({ message: "Modèle supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du modèle", error: error.message });
    }
};

const generateSMS = async (req, res) => {
    try {
        console.log("Données reçues dans la requête :", req.body); // 🔍 Debug

        // Vérifier si req.body est bien défini
        if (!req.body) {
            return res.status(400).json({ status: "error", message: "Requête invalide : le corps est vide" });
        }

        const { template, contactMatricule } = req.body;
        

        // Vérification des données requises
        if (!template || !contactMatricule) {
            return res.status(400).json({ status: "error", message: "Données manquantes: template et contactMatricule sont requis" });
        }

        // Récupération du contact par matricule
        const contact = await Contact.getByMatricule(contactMatricule);
        if (!contact) {
            return res.status(404).json({ status: "error", message: "Contact non trouvé" });
        }

        // Vérifier que contact est un objet et non null
        if (typeof contact !== "object" || Array.isArray(contact)) {
            return res.status(500).json({ status: "error", message: "Erreur serveur : format des données incorrect" });
        }

        // Fonction de remplacement des variables dynamiques
        const replaceVariables = (template, data) => {
            return template.replace(/{{(.*?)}}/g, (match, key) => {
                return data[key.trim()] || match; // Si la clé n'existe pas, on garde le placeholder
            });
        };

        const messageFinal = replaceVariables(template, contact);

        return res.status(200).json({
            status: "success",
            message: messageFinal
        });

    } catch (error) {
        console.error("Erreur serveur :", error);
        return res.status(500).json({ 
            status: "error", 
            message: "Erreur lors de la génération du SMS", 
            error: error.message 
        });
    }
};
const sendMessageToGroup = async (req, res) => {
    try {
        const { groupId } = req.params;  
        const { modeleId } = req.body;

        if (!modeleId) {
            return res.status(400).json({ status: "error", message: "Le champ 'modeleId' est requis" });
        }

        // 🔹 Récupérer le modèle de SMS depuis la base de données
        const modele = await ModeleSMS.getById(modeleId);
        if (!modele) {
            return res.status(404).json({ status: "error", message: `Modèle de SMS non trouvé pour l'ID ${modeleId}` });
        }

        const template = modele.contenu; // Contenu du modèle de SMS
        console.log("📝 Modèle de SMS récupéré :", template); // Debug

        // 🔹 Récupérer tous les contacts du groupe
        const contacts = await ContactGroupe.getContactsByGroup(groupId);
        if (!contacts || contacts.length === 0) {
            return res.status(404).json({ status: "error", message: `Aucun contact trouvé pour le groupId ${groupId}` });
        }

        console.log("📋 Contacts récupérés :", contacts); // Debug

        // 🔹 Fonction améliorée pour remplacer les variables dynamiques
        const replaceVariables = (template, data) => {
            return template.replace(/{{(.*?)}}/g, (match, key) => {
                const valeur = data[key.trim()]; // Supprimer les espaces
                if (valeur !== undefined) {
                    return valeur; // Remplace par la vraie valeur
                } else {
                    console.warn(`⚠️ Clé introuvable : ${key.trim()}`);
                    return match; // Garder le placeholder si la clé est introuvable
                }
            });
        };

        // 🔹 Générer un message personnalisé pour chaque contact
        const messages = contacts.map(contact => {
            console.log("🔍 Contact en cours de traitement :", contact); // Debug
            return {
                matricule: contact.matricule,
                telephone: contact.telephone_personnel,
                message: replaceVariables(template, contact)
            };
        });

        return res.status(200).json({
            status: "success",
            modeleId,
            group: groupId,
            totalContacts: contacts.length,
            messages
        });

    } catch (error) {
        console.error("❌ Erreur serveur :", error);
        return res.status(500).json({ 
            status: "error", 
            message: "Erreur lors de l'envoi des messages", 
            error: error.message 
        });
    }
};



const sendConfidentialMessage = async (req, res) => {
    try {
        const { modeleId } = req.params;

        // Vérification du fichier
        if (!req.file) {
            return res.status(400).json({ status: "error", message: "Fichier Excel requis" });
        }

        // Vérification de l'ID du modèle
        if (!modeleId) {
            return res.status(400).json({ status: "error", message: "Le champ 'modeleId' est requis" });
        }

        // 🔹 1. Récupérer le modèle de SMS
        const modele = await ModeleSMS.getById(modeleId);
        if (!modele) {
            return res.status(404).json({ status: "error", message: `Modèle de SMS non trouvé pour l'ID ${modeleId}` });
        }

        const template = modele.contenu; // Contenu du modèle de SMS

        // 🔹 2. Lire les données du fichier Excel
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (data.length === 0) {
            return res.status(400).json({ status: "error", message: "Le fichier Excel est vide." });
        }

        // 🔹 3. Remplacer les variables dans le modèle de SMS
        const replaceVariables = (template, contact) => {
            return template.replace(/{{(.*?)}}/g, (match, key) => {
                // Récupérer la valeur de la variable dynamique à partir du contact
                const trimmedKey = key.trim();
                return contact[trimmedKey] || match; // Si la variable n'est pas trouvée, garder le placeholder
            });
        };

        // 🔹 4. Validation des données dans le fichier Excel
        const validatedData = data.filter(contact => {
            if (!contact.Matricule || !contact.Telephone) {
                console.log("Données invalides pour un contact", contact);
                return false; // Ignore les contacts mal formés
            }
            return true;
        });

        if (validatedData.length === 0) {
            return res.status(400).json({ status: "error", message: "Aucun contact valide trouvé dans le fichier." });
        }

        // 🔹 5. Générer les messages personnalisés
        const messages = validatedData.map(contact => ({
            matricule: contact.Matricule,
            telephone: contact.Telephone,
            message: replaceVariables(template, contact) // Utilisation de 'template' avec les variables dynamiques remplacées
        }));

        return res.status(200).json({
            status: "success",
            modeleId,
            totalContacts: validatedData.length,
            messages
        });

    } catch (error) {
        console.error("Erreur serveur :", error);
        return res.status(500).json({
            status: "error",
            message: "Erreur lors de l'envoi des messages",
            error: error.message
        });
    }
};







module.exports = { createModel, getAllModels, getModelById, updateModel, deleteModel, generateSMS, sendMessageToGroup, sendConfidentialMessage };
