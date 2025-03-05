const express = require('express');
const router = express.Router();
const { isAuthenticated, checkRole } = require('../middlewares/authMiddleware');

const  {createContact, getContacts, getContactByMatricule, updateContact, deleteContact, getContactsByGroup } = require('../controllers/contactController');

router.post('/addcontacts', createContact);
router.get('/contacts', getContacts);
router.get('/contacts/:matricule', getContactByMatricule);
router.get('/contacts/group/:groupName', getContactsByGroup);
router.put('/contacts/:id', updateContact);
router.delete('/contacts/:id', deleteContact);

module.exports = router;
