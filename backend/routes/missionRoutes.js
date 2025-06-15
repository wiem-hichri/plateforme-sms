// routes/missionRoutes.js
const express = require('express');
const router = express.Router();
const { isAuthentificated, checkRole } = require('../middlewares/authMiddleware'); 
const {
    createMission,
    getMissions,
    getMissionById,
    updateMission,
    deleteMission,
} = require('../controllers/missionController');


router.post('/addmission', isAuthentificated, checkRole('super-administrateur', 'Administrateur'), createMission);
router.get('/missions', isAuthentificated, checkRole('super-administrateur', 'Administrateur'), getMissions);
router.get('/missions/:id', isAuthentificated, checkRole('super-administrateur', 'Administrateur'), getMissionById);
router.put('/missions/:id', isAuthentificated, checkRole('super-administrateur', 'Administrateur'), updateMission);
router.delete('/missions/:id', isAuthentificated, checkRole('super-administrateur', 'Administrateur'), deleteMission);

module.exports = router;
