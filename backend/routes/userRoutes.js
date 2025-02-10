const express = require('express');
const router = express.Router();
const  {createUser, getUsers, getUserById, updateUser, deleteUser, login } = require('../controllers/userController');

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users/login', login);


module.exports = router;
