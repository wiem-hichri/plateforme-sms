const express = require('express');
const router = express.Router();
const ContactGroupeController = require('../controllers/contactGroupeController');
const { isAuthentificated, checkRole } = require('../middlewares/authMiddleware');


router.post('/contacts/group', isAuthentificated, checkRole( 'super-administrateur','administrateur', 'utilisateur'), ContactGroupeController.associateContactsToGroup);
router.get('/contact/:contactId/groups',isAuthentificated, checkRole( 'super-administrateur','administrateur', 'utilisateur'), ContactGroupeController.getGroupsByContact);
router.get('/group/:groupId/contacts',isAuthentificated, checkRole( 'super-administrateur','administrateur', 'utilisateur'), ContactGroupeController.getContactsByGroup);
router.delete('/delete', isAuthentificated, checkRole( 'super-administrateur','administrateur', 'utilisateur'), ContactGroupeController.disassociateContactsFromGroup);

module.exports = router;
