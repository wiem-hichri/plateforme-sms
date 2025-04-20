const express = require('express');
const router = express.Router();
const { genererSMS } = require('../controllers/openaiController');





router.post('/api/generate-sms', genererSMS);




module.exports = router;
