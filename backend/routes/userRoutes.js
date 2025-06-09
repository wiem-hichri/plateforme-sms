const express = require('express');
const router = express.Router();
const { isAuthentificated, checkRole } = require('../middlewares/authMiddleware');
const  {createUser,updatePassword, getUsers, getUserById, updateUser, deleteUser, getAllLoginHistory } = require('../controllers/userController');


router.post('/addusers',isAuthentificated, checkRole( 'super-administrateur','administrateur'), createUser);
router.get('/users',isAuthentificated, checkRole( 'super-administrateur','administrateur'), getUsers);
router.get('/users/:id',isAuthentificated, checkRole( 'super-administrateur','administrateur'), getUserById);
router.put('/users/:id',isAuthentificated, checkRole( 'super-administrateur','administrateur','Employé'), updateUser);
router.delete('/users/:id',isAuthentificated, checkRole( 'super-administrateur','administrateur'), deleteUser);
router.put('/users/password/:id',isAuthentificated, checkRole( 'super-administrateur','administrateur','Employé'), updatePassword);
router.get('/login-history', getAllLoginHistory);




module.exports = router;
