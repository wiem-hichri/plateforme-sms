const ContactGroupe = require('../models/contactGroupe');

// Associer un contact à un groupe
const associateContactToGroup = async (req, res) => {
    try {
        const { contactId, groupId } = req.body;
        await ContactGroupe.associateContactToGroup(contactId, groupId);
        res.status(201).json({ message: "Contact associé au groupe avec succès." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer les groupes associés à un contact
const getGroupsByContact = async (req, res) => {
    try {
        const contactId = req.params.contactId;
        const groupes = await ContactGroupe.getGroupsByContact(contactId);
        res.json({ status: "success", data: groupes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer les contacts associés à un groupe
const getContactsByGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const contacts = await ContactGroupe.getContactsByGroup(groupId);
        res.json({ status: "success", data: contacts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer une association entre un contact et un groupe
const deleteAssociation = async (req, res) => {
    try {
        const { contactId, groupId } = req.body;
        await ContactGroupe.deleteAssociation(contactId, groupId);
        res.json({ message: "Association supprimée avec succès." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { associateContactToGroup, getGroupsByContact, getContactsByGroup, deleteAssociation };
