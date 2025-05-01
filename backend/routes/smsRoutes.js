const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../middlewares/authMiddleware');
const { smsCount,
    insertSMS,
    getSMS,
    deleteSMS,
    smsSent} = require('../controllers/smsController');

router.get('/count', smsCount);
router.post('/insert',  insertSMS);
router.get('/recent', getSMS);
router.delete('/delete',isAuthentificated, deleteSMS);
router.post('/sent', smsSent)

module.exports = router;
