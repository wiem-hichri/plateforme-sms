const express = require('express');
const router = express.Router();
const { genererSMS } = require('../controllers/claudController');
const { isAuthentificated, checkRole } = require('../middlewares/authMiddleware');


router.post('/generate-sms-claud', genererSMS);




module.exports = router;
