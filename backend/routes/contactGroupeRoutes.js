const express = require('express');
const router = express.Router();
const ContactGroupeController = require('../controllers/contactGroupeController');





router.post('/associate', ContactGroupeController.associateContactToGroup);
router.get('/contact/:contactId', ContactGroupeController.getGroupsByContact);
router.get('/groupe/:groupId', ContactGroupeController.getContactsByGroup);
router.delete('/delete', ContactGroupeController.deleteAssociation);




module.exports = router;
