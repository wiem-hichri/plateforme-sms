const Device = require('../models/device');

const createDevice = async (req, res) => {
    try {
        const { nom, proprietaire } = req.body;
        const device = { nom, proprietaire };
        const result = await Device.create(device);
        res.status(201).json({ message: "Device créé avec succès", deviceId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du device', error: error.message });
    }
};

const getDevices = async (req, res) => {
    try {
        const devices = await Device.getAll();
        res.json({ status: "success", data: devices });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des devices', error: error.message });
    }
};

const updateDevice = async (req, res) => {
    try {
        const deviceId = req.params.id;
        const { nom, proprietaire } = req.body;
        const device = { nom, proprietaire };
        const result = await Device.update(deviceId, device);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Device non trouvé' });
        }

        res.status(200).json({ message: 'Device mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du device', error: error.message });
    }
};

const deleteDevice = async (req, res) => {
    try {
        const deviceId = req.params.id;
        const result = await Device.delete(deviceId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Device non trouvé' });
        }

        res.status(200).json({ message: 'Device supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du device', error: error.message });
    }
};

module.exports = { createDevice, getDevices, updateDevice, deleteDevice };
