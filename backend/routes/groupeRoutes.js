const express = require('express');
const { isAuthentificated, checkRole } = require('../middlewares/authMiddleware');
const { createGroupe, getGroupes, getGroupeById, updateGroupe, deleteGroupe } = require('../controllers/groupeController');
const router = express.Router();

router.post('/addgroupes',isAuthentificated, checkRole( 'utilisateur','super-administrateur','administrateur'), createGroupe);
router.get('/groupes',isAuthentificated, checkRole( 'utilisateur','super-administrateur','administrateur'), getGroupes);
router.get('/groupes/:id',isAuthentificated, checkRole( 'utilisateur','super-administrateur','administrateur'), getGroupeById);
router.put('/groupes/:id',isAuthentificated, checkRole( 'utilisateur','super-administrateur','administrateur'), updateGroupe);
router.delete('/groupes/:id',isAuthentificated, checkRole( 'utilisateur','super-administrateur','administrateur'), deleteGroupe);


module.exports = router;
