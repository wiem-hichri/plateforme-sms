const express = require('express');
const router = express.Router();
//const passport = require('../config/passport');
//const { checkRole } = require('../middlewares/authMiddleware');
const  {createUser,updatePassword, getUsers, getUserById, updateUser, deleteUser, login } = require('../controllers/userController');

/*router.post('/addusers', passport.authenticate('jwt', { session: false }),
checkRole(['super-admin', 'admin']),  createUser);*/
router.post('/addusers', createUser);

router.get('/users', getUsers);

router.get('/users/:id', getUserById);

router.put('/users/:id', updateUser);

router.delete('/users/:id', deleteUser);

router.put('/users/password/:id', updatePassword);

router.post('/users/login', login);



module.exports = router;
