const express = require('express'); 
const { login, logout, CurrentUser, resetPassword } = require('../controllers/authController'); 
const router = express.Router(); 
 
router.post('/auth/login', login); 
router.post('/auth/logout', logout); 
router.get('/auth/current-user', CurrentUser); 
router.post('/auth/reset-password', resetPassword); // New route for password reset
 
module.exports = router;