const User = require('../models/user');
const db = require('../config/dbConnect').promise();


const login = async (req, res) => {
    try {
        const { login, password } = req.body;
        const user = await User.getByLogin(login);

        if (!user) {
            return res.status(400).json({ message: "Login incorrect" });
        }

        if (password !== user.password) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        const expiryDate = new Date(user.password_expiry);
        const today = new Date();
        const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

        if (today > expiryDate) {
            return res.status(403).json({ expired: true, message: "Votre mot de passe a expiré. Veuillez le réinitialiser." });
        }

        let warningMessage = null;
        if (daysLeft <= 7) {
            warningMessage = `Votre mot de passe expire dans ${daysLeft} jour(s). Pensez à le changer.`;
        }

        await User.updateLastLogin(user.id);

        req.session.user = {
            id: user.id,
            nom: user.nom,
            matricule: user.matricule,
            prenom: user.prenom,
            role: user.role,
            login: user.login,
            dernierLogin: new Date()
        };

        await db.query(
            "INSERT INTO login_history (user_id, ip_address, user_agent) VALUES (?, ?, ?)",
            [user.id, req.ip || req.connection.remoteAddress, req.headers['user-agent']]
        );

        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ message: "Erreur de session" });
            }
            res.json({
                message: "Connexion réussie",
                user: req.session.user,
                warning: warningMessage,
                expired: false
            });
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};




const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la déconnexion" });
        res.clearCookie('connect.sid');
        res.json({ message: "Déconnexion réussie" });
    });
};


const CurrentUser = (req, res) => {
    console.log("Session actuelle :", req.session);

    if (!req.session || !req.session.user) {
        console.error("⚠️ Aucune session trouvée !");
        return res.status(401).json({ message: "Non authentifié" });
    }

    res.json(req.session.user);
};


module.exports = { login, logout, CurrentUser };
