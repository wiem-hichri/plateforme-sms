const Contact = require('../models/contact');


const createContact = async (req, res) => {
    try {
        const { userId, contact } = req.body;
        const result= await Contact.create(contact, userId);
        res.status(201).json({ message: "Contact ajouté avec succées.", contactId: result.id });
    
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        const { matricule } = req.params; // Récupérer le matricule depuis l'URL
        if (!matricule) {
            return res.status(400).json({ status: "error", message: "Matricule requis" });
        }

        const contact = await Contact.getByMatricule(matricule);

        if (!contact) {
            return res.status(404).json({ status: "error", message: "Contact non trouvé" });
        }

        return res.status(200).json({
            status: "success",
            data: contact,
        });

    } catch (error) {
        console.error("Erreur serveur:", error);
        return res.status(500).json({ 
            status: "error", 
            message: "Erreur lors de la récupération du contact", 
            error: error.message 
        });
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


const importContacts = (req, res) => {
    const contacts = req.body;
  
    if (!Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ message: 'Invalid data' });
    }
  
    // Fetch existing contacts from the database
    Contact.getAll().then((existingContacts) => {
      const existingMatricules = existingContacts.map(contact => contact.matricule);
  
      // Filter out contacts that already exist
      const newContacts = contacts.filter(contact => !existingMatricules.includes(contact.matricule));
  
      if (newContacts.length === 0) {
        return res.json({ message: 'All contacts already exist.', importedCount: 0 });
      }
  
      // Add new contacts to the database
      Contact.addMultipleContacts(newContacts, (err, result) => {
        if (err) {
          console.error('❌ Error inserting contacts:', err);
          return res.status(500).json({ message: 'Database error' });
        }
        res.json({ message: '✅ Contacts imported successfully', importedCount: result.affectedRows });
      });
    }).catch((error) => {
      console.error('Error fetching existing contacts:', error);
      res.status(500).json({ message: 'Error fetching existing contacts' });
    });
  };
  


module.exports = { createContact, getContacts, getContactByMatricule, updateContact, deleteContact, getContactsByGroup, importContacts };
