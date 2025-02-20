const express = require('express');
const { createGroupe, getGroupes, getGroupeById, updateGroupe, deleteGroupe } = require('../controllers/groupeController');
const router = express.Router();

router.post('/addgroupes', createGroupe);
router.get('/groupes', getGroupes);
router.get('/groupes/:id', getGroupeById);
router.put('/groupes/:id', updateGroupe);
router.delete('/groupes/:id', deleteGroupe);


module.exports = router;
