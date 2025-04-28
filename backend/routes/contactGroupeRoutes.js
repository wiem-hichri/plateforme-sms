const express = require('express');
const router = express.Router();
const ContactGroupeController = require('../controllers/contactGroupeController');
const { isAuthentificated, checkRole } = require('../middlewares/authMiddleware');


router.post('/contacts/:contactId/groups', isAuthentificated, checkRole( 'super-administrateur','administrateur'), ContactGroupeController.associateContactToGroups);
router.get('/contact/:contactId/groups',isAuthentificated, checkRole( 'super-administrateur','administrateur'), ContactGroupeController.getGroupsByContact);
router.get('/group/:groupId/contacts',isAuthentificated, checkRole( 'super-administrateur','administrateur'), ContactGroupeController.getContactsByGroup);
router.delete('/delete', isAuthentificated, checkRole( 'super-administrateur','administrateur'), ContactGroupeController.deleteAssociation);

module.exports = router;
