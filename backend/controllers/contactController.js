const Contact = require('../models/contact');
const Groupe = require('../models/groupe'); 


const createContact = async (req, res) => {
    try {
        const contact = req.body;
        const result = await Contact.create(contact);
        res.status(201).json({ message: 'Contact créé avec succès', contactId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du contact', error: error.message });
    }
};

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.getAll();
        res.json({
            status: "success",
            data: contacts,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des contacts', error: error.message });
    }
};

const getContactByMatricule = async (req, res) => {
    try {
        const contactMatricule = req.params.matricule;
        const contact = await Contact.getByMatricule(contactMatricule);
        if (!contact) {
            return res.status(404).json({ message: 'Contact non trouvé' });
        }
        res.json({
            status: "success",
            data: contact,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du contact', error: error.message });
    }
};

const updateContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const newContactData = req.body;
        const result = await Contact.update(contactId, newContactData);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Contact non trouvé' });
        }
        res.status(200).json({ message: 'Contact mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du contact', error: error.message });
    }
};

const deleteContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const result = await Contact.delete(contactId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Contact non trouvé' });
        }
        res.status(200).json({ message: 'Contact supprimé avec succès' });
       
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du contact', error: error.message });
    }
};

const getContactsByGroup = async (req, res) => {
    try {
        const { groupName } = req.params;  
        const contacts = await Contact.getByGroup(groupName); 

        if (contacts.length === 0) {
            return res.status(404).json({ message: 'Aucun contact trouvé pour ce groupe' });
        }

        res.json({
            status: "Success",
            data: contacts,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des contacts', error: error.message });
    }
};

module.exports = { createContact, getContacts, getContactByMatricule, updateContact, deleteContact, getContactsByGroup };
