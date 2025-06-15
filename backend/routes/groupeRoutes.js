const express = require('express');
const { isAuthentificated, checkRole } = require('../middlewares/authMiddleware');
const { createGroupe, getGroupes, getGroupeById, updateGroupe, deleteGroupe } = require('../controllers/groupeController');
const router = express.Router();

router.post('/addgroupes',isAuthentificated, checkRole( 'Employé','super-administrateur','Administrateur'), createGroupe);
router.get('/groupes',isAuthentificated, checkRole( 'Employé','super-administrateur','Administrateur'), getGroupes);
router.get('/groupes/:id',isAuthentificated, checkRole( 'Employé','super-administrateur','Administrateur'), getGroupeById);
router.put('/groupes/:id',isAuthentificated, checkRole( 'Employé','super-administrateur','Administrateur'), updateGroupe);
router.delete('/groupes/:id',isAuthentificated, checkRole( 'Employé','super-administrateur','Administrateur'), deleteGroupe);


module.exports = router;
