const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { checkRole } = require('../middlewares/authMiddleware');
const  {createUser, getUsers, getUserById, updateUser, deleteUser, login } = require('../controllers/userController');

router.post('/addusers', passport.authenticate('jwt', { session: false }),
checkRole(['super-admin', 'admin']),  createUser);

router.get('/users', passport.authenticate('jwt', { session: false }),
checkRole(['super-admin', 'admin']), getUsers);

router.get('/users/:id', passport.authenticate('jwt', { session: false }),
checkRole(['super-admin', 'admin']), getUserById);

router.put('/users/:id', passport.authenticate('jwt', { session: false }),
checkRole(['super-admin', 'admin']), updateUser);

router.delete('/users/:id', passport.authenticate('jwt', { session: false }),
checkRole(['super-admin', 'admin']), deleteUser);

router.post('/users/login', login);



module.exports = router;
