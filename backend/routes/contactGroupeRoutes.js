const express = require('express');
const router = express.Router();
const ContactGroupeController = require('../controllers/contactGroupeController');

router.post('/contacts/:contactId/groups', ContactGroupeController.associateContactToGroups);
router.get('/contact/:contactId/groups', ContactGroupeController.getGroupsByContact);
router.get('/group/:groupId/contacts', ContactGroupeController.getContactsByGroup);
router.delete('/delete', ContactGroupeController.deleteAssociation);

module.exports = router;
