const Historique = require('../models/historiqueEnvoi');




const getHistorique = async (req, res) => {
    try {
        const userID = req.query.userID || req.session.user.id;  
        const isSuperAdmin = req.session.user.role === 'super-administrateur';  

        const messages = await Historique.getHistoriqueMessages(userID, isSuperAdmin);

        if (messages.length === 0) {
            return res.status(404).json({ message: 'Aucun message trouvé.' });
        }

        res.status(200).json({ messages });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'historique des messages :", error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getHistorique
};
