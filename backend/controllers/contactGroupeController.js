const ContactGroupe = require('../models/contactGroupe');



const associateContactsToGroup = async (req, res) => {
    const { contactIds, groupId } = req.body;
  
    if (!Array.isArray(contactIds)) {
      return res.status(400).json({ message: "contactIds must be an array" });
    }
  
    try {
      const result = await ContactGroupe.associateContactsToGroup(contactIds, groupId);
      res.status(200).json({ message: 'Contacts associés au groupe avec succès.', affectedRows: result.affectedRows });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l’association', error: error.message });
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

const disassociateContactsFromGroup = async (req, res) => {
    const { contactIds, groupId } = req.body;

    if (!Array.isArray(contactIds)) {
        return res.status(400).json({ message: "contactIds must be an array" });
    }

    try {
        const result = await ContactGroupe.disassociateContactsFromGroup(contactIds, groupId);
        res.status(200).json({ message: "Contacts désassociés du groupe avec succès.", affectedRows: result.affectedRows });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la désassociation", error: error.message });
    }
};


module.exports = { associateContactsToGroup, getGroupsByContact, getContactsByGroup, disassociateContactsFromGroup };
