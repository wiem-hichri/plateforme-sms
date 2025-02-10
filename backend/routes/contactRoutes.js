const express = require('express');
const router = express.Router();
const  {createContact, getContacts, getContactById, updateContact, deleteContact } = require('../controllers/contactController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/contacts', createContact);
router.get('/contacts', authMiddleware, getContacts);
router.get('/contacts/:id', getContactById);
router.put('/contacts/:id', updateContact);
router.delete('/contacts/:id', deleteContact);

module.exports = router;
