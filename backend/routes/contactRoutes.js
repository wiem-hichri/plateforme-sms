const express = require('express');
const router = express.Router();
const  {createContact, getContacts, getContactById, updateContact, deleteContact } = require('../controllers/contactController');

router.post('/contacts', createContact);
router.get('/contacts', getContacts);
router.get('/contacts/:id', getContactById);
router.put('/contacts/:id', updateContact);
router.delete('/contacts/:id', deleteContact);

module.exports = router;
