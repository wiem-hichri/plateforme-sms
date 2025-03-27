const express = require('express');
const router = express.Router();
const ContactGroupeController = require('../controllers/contactGroupeController');

// Route to associate a contact with multiple groups
router.post('/contacts/:contactId/groups', ContactGroupeController.associateContactToGroups);

// Route to get groups associated with a contact
router.get('/contact/:contactId/groups', ContactGroupeController.getGroupsByContact);

// Route to get contacts associated with a group
router.get('/group/:groupId/contacts', ContactGroupeController.getContactsByGroup);

// Route to delete an association between a contact and a group
router.delete('/delete', ContactGroupeController.deleteAssociation);

module.exports = router;
