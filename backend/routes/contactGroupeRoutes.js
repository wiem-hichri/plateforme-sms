const express = require('express');
const router = express.Router();
const ContactGroupeController = require('../controllers/contactGroupeController');
const { isAuthentificated, checkRole } = require('../middlewares/authMiddleware');


router.post('/contacts/group', isAuthentificated, checkRole( 'super-administrateur','Administrateur', 'Employé'), ContactGroupeController.associateContactsToGroup);
router.get('/contact/:contactId/groups',isAuthentificated, checkRole( 'super-administrateur','Administrateur', 'Employé'), ContactGroupeController.getGroupsByContact);
router.get('/group/:groupId/contacts',isAuthentificated, checkRole( 'super-administrateur','Administrateur', 'Employé'), ContactGroupeController.getContactsByGroup);
router.delete('/delete', isAuthentificated, checkRole( 'super-administrateur','Administrateur', 'Employé'), ContactGroupeController.disassociateContactsFromGroup);

module.exports = router;
