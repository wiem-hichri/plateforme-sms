const express = require('express');
const { createVariable, getAllVariables, deleteVariable } = require('../controllers/variableController');
const router = express.Router();

router.post('/variables/', createVariable);
router.get('/variables/', getAllVariables);
router.delete('/variables/:id', deleteVariable);

module.exports = router;
