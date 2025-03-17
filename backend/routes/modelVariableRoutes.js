const express = require('express');
const router = express.Router();
const modelVariableController = require('../controllers/modelVariableController');

router.post('/associate', modelVariableController.associateVariable);
router.get('/model/:modelId', modelVariableController.getVariablesByModel);
router.get('/variable/:variableId', modelVariableController.getModelsByVariable);
router.delete('/delete', modelVariableController.deleteAssociation);

module.exports = router;
