const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { isAuthentificated, checkRole } = require('../middlewares/authMiddleware');
const  {createContact, getContacts, getContactByMatricule, updateContact, deleteContact, getContactsByGroup, importContacts,getPhonesAndMatriculesByGroupId } = require('../controllers/contactController');



router.post('/addcontacts',isAuthentificated, checkRole( 'super-administrateur','administrateur'), createContact);
router.get('/contacts',isAuthentificated, checkRole( 'utilisateur','super-administrateur','administrateur'), getContacts);
router.get('/contacts/:matricule', getContactByMatricule);
router.get('/contacts/group/:groupName',isAuthentificated, checkRole( 'utilisateur','super-administrateur','administrateur'), getContactsByGroup);
router.put('/contacts/:id',isAuthentificated,isAuthentificated, checkRole( 'utilisateur','super-administrateur','administrateur'), updateContact);
router.delete('/contacts/:id',isAuthentificated, checkRole('utilisateur', 'super-administrateur','administrateur'), deleteContact);
router.post('/import-contacts',isAuthentificated, checkRole( 'utilisateur','super-administrateur','administrateur') ,importContacts);
router.get('/phones-matricules/:groupId',getPhonesAndMatriculesByGroupId);


module.exports = router;
