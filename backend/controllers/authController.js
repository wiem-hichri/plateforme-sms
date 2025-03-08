const User = require('../models/user');
const db = require('../config/dbConnect').promise();
const login = async (req, res) => {
    try {
        const { login, password } = req.body;
        const user = await User.getByLogin(login);

        if (!user) {
            return res.status(400).json({ message: "Login incorrect" });
        }

        // Vérification directe du mot de passe sans hachage
        if (password !== user.password) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        const expiryDate = new Date(user.password_expiry);
        if (new Date() > expiryDate) {
            return res.status(403).json({ message: "Votre mot de passe a expiré, veuillez le changer." });
        }

        await User.updateLastLogin(user.id);

        // ✅ Stocker les informations de l'utilisateur dans la session
        req.session.user = {
            nom: user.nom,
            prenom: user.prenom,
            id: user.id,
            role: user.role,
            login: user.login,
            dernierLogin: new Date()
        };

        // Enregistrement de la connexion
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

        await db.query(
            "INSERT INTO login_history (user_id, ip_address, user_agent) VALUES (?, ?, ?)",
            [user.id, ipAddress, userAgent]
        );

        // ✅ Assurer l'enregistrement de la session avant d'envoyer la réponse
        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ message: "Erreur de session" });
            }
            res.json({ message: "Connexion réussie", user: req.session.user });
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
