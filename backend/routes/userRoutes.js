const express = require('express');
const router = express.Router();
//const passport = require('../config/passport');
const { isAuthenticated, checkRole } = require('../middlewares/authMiddleware');
const  {createUser,updatePassword, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');


router.post('/addusers', createUser);

router.get('/users', getUsers);

router.get('/users/:id', getUserById);

router.put('/users/:id', updateUser);

router.delete('/users/:id', deleteUser);

router.put('/users/password/:id', updatePassword);




module.exports = router;
