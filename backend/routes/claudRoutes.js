const express = require('express');
const router = express.Router();
const { genererSMS } = require('../controllers/claudController');





router.post('/generate-sms-claud', genererSMS);




module.exports = router;
