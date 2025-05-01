const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../middlewares/authMiddleware');
const { smsCount,
    insertSMS,
    getSMS,
    deleteSMS,
    smsSent} = require('../controllers/smsController');

router.get('/count', isAuthentificated, smsCount);
router.post('/insert', isAuthentificated, insertSMS);
router.get('/recent',isAuthentificated, getSMS);
router.delete('/delete',isAuthentificated, deleteSMS);
router.post('/sent',isAuthentificated, smsSent)

module.exports = router;
