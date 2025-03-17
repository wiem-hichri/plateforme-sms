const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { isAuthentificated, checkRole } = require('../middlewares/authMiddleware');

const  {createContact, getContacts, getContactByMatricule, updateContact, deleteContact, getContactsByGroup, importContacts } = require('../controllers/contactController');

router.post('/addcontacts',isAuthentificated, checkRole( 'super-administrateur','administrateur'), createContact);
router.get('/contacts',isAuthentificated, checkRole( 'super-administrateur','administrateur'), getContacts);
router.get('/contacts/:matricule', getContactByMatricule);
router.get('/contacts/group/:groupName',isAuthentificated, checkRole( 'super-administrateur','administrateur'), getContactsByGroup);
router.put('/contacts/:id',isAuthentificated,isAuthentificated, checkRole( 'super-administrateur','administrateur'), updateContact);
router.delete('/contacts/:id',isAuthentificated, checkRole( 'super-administrateur','administrateur'), deleteContact);
router.post('/import-contacts',isAuthentificated, checkRole( 'super-administrateur','administrateur') ,importContacts);


module.exports = router;
