const express = require('express');
const { login, logout ,CurrentUser } = require('../controllers/authController');
const router = express.Router();

router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.get('/auth/current-user',CurrentUser);


module.exports = router;
