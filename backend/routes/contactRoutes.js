const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { isAuthentificated, checkRole } = require('../middlewares/authMiddleware');
const  {createContact, getContacts, getContactByMatricule, updateContact, deleteContact, getPhonesByMatricules,getContactsByGroup, importContacts,getPhonesAndMatriculesByGroupId } = require('../controllers/contactController');



router.post('/addcontacts',isAuthentificated, checkRole( 'Employé','super-administrateur','Administrateur'), createContact);
router.get('/contacts',isAuthentificated, checkRole( 'Employé','super-administrateur','Administrateur'), getContacts);
router.get('/contacts/:matricule', getContactByMatricule);
router.get('/contacts/group/:groupName',isAuthentificated, checkRole( 'Employé','super-administrateur','Administrateur'), getContactsByGroup);
router.put('/contacts/:id',isAuthentificated,isAuthentificated, checkRole( 'Employé','super-administrateur','Administrateur'), updateContact);
router.delete('/contacts/:id',isAuthentificated, checkRole('Employé', 'super-administrateur','Administrateur'), deleteContact);
router.post('/import-contacts',isAuthentificated, checkRole( 'Employé','super-administrateur','Administrateur') ,importContacts);
router.get('/phones-matricules/:groupId',getPhonesAndMatriculesByGroupId);
router.post('/phones-by-matricules', getPhonesByMatricules);


module.exports = router;
