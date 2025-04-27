const express = require('express');
const router = express.Router();
const { genererSMS } = require('../controllers/openaiController');





router.post('/generate-sms', genererSMS);




module.exports = router;
