const ContactGroupe = require('../models/contactGroupe');

const associateContactToGroups = async (req, res) => {
    const { contactId } = req.params;
    const { groupIds } = req.body;

    try {
        const result = await ContactGroupe.associateContactToGroups(contactId, groupIds);
        res.status(200).json({ message: 'Contact associated with groups successfully.', affectedRows: result.affectedRows });
    } catch (error) {
        res.status(500).json({ message: 'Error associating contact with groups', error: error.message });
    }
};

const getGroupsByContact = async (req, res) => {
    try {
        const contactId = req.params.contactId;
        const groupes = await ContactGroupe.getGroupsByContact(contactId);
        res.json({ status: "success", data: groupes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getContactsByGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const contacts = await ContactGroupe.getContactsByGroup(groupId);
        res.json({ status: "success", data: contacts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAssociation = async (req, res) => {
    try {
        const { contactId, groupId } = req.body;
        await ContactGroupe.deleteAssociation(contactId, groupId);
        res.json({ message: "Association supprimée avec succès." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { associateContactToGroups, getGroupsByContact, getContactsByGroup, deleteAssociation };
