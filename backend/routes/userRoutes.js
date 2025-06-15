const express = require('express');
const router = express.Router();
const { isAuthentificated, checkRole } = require('../middlewares/authMiddleware');
const  {createUser,updatePassword, getUsers, getUserById, updateUser, deleteUser, getAllLoginHistory } = require('../controllers/userController');


router.post('/addusers',isAuthentificated, checkRole( 'super-administrateur','Administrateur'), createUser);
router.get('/users',isAuthentificated, checkRole( 'super-administrateur','Administrateur'), getUsers);
router.get('/users/:id',isAuthentificated, checkRole( 'super-administrateur','Administrateur'), getUserById);
router.put('/users/:id',isAuthentificated, checkRole( 'super-administrateur','Administrateur','Employé'), updateUser);
router.delete('/users/:id',isAuthentificated, checkRole( 'super-administrateur','Administrateur'), deleteUser);
router.put('/users/password/:id',isAuthentificated, checkRole( 'super-administrateur','Administrateur','Employé'), updatePassword);
router.get('/login-history', getAllLoginHistory);




module.exports = router;
