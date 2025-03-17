const express = require('express');
const { createModel, getAllModels, getModelById, updateModel, deleteModel, generateSMS } = require('../controllers/modelController');
const router = express.Router();

router.post('/models/', createModel);
router.get('/models/', getAllModels);
router.get('/models/:id', getModelById);
router.put('/models/:id', updateModel);
router.delete('/models/:id', deleteModel);
router.post("/models/generate-sms", generateSMS);


module.exports = router;
