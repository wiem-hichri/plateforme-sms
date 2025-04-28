const express = require('express');
const router = express.Router();
const { genererSMS } = require('../controllers/claudController');
const { isAuthentificated, checkRole } = require('../middlewares/authMiddleware');






router.post('/generate-sms-claud', isAuthentificated, checkRole( 'super-administrateur','administrateur', 'utilisateur'), genererSMS);




module.exports = router;
