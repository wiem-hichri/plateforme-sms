const Site = require('../models/site');

// Créer un site
const createSite = async (req, res) => {
    try {
        const { site_name } = req.body;
        const site = { site_name };
        const result = await Site.create(site);
        res.status(201).json({ message: "Site créé avec succès", siteId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du site', error: error.message });
    }
};

// Lire tous les sites
const getSites = async (req, res) => {
    try {
        const sites = await Site.getAll();
        res.json({
            status: "success",
            data: sites,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des sites', error: error.message });
    }
};

// Mettre à jour un site
const updateSite = async (req, res) => {
    try {
        const siteId = req.params.id;
        const { site_name } = req.body;
        const site = { site_name };
        const result = await Site.update(siteId, site);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Site non trouvé' });
        }

        res.status(200).json({ message: 'Site mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du site', error: error.message });
    }
};

// Supprimer un site
const deleteSite = async (req, res) => {
    try {
        const siteId = req.params.id;
        const result = await Site.delete(siteId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Site non trouvé' });
        }

        res.status(200).json({ message: 'Site supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du site', error: error.message });
    }
};

module.exports = { createSite, getSites, updateSite, deleteSite };
