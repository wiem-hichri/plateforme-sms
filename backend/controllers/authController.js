const bcrypt = require('bcrypt');
const User = require('../models/user');


const login = async (req, res) => {
    try {
        const { login, password } = req.body;
        const user = await User.getByLogin(login);

        if (!user) {
            return res.status(400).json({ message: "Login incorrect" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        // Vérifier si le mot de passe a expiré
        const expiryDate = new Date(user.password_expiry);
        const now = new Date();

        if (now > expiryDate) {
            return res.status(403).json({ message: "Votre mot de passe a expiré, veuillez le changer." });
        }

        // Stocker les infos utilisateur dans la session
        req.session.user = {
            id: user.id,
            role: user.role,
            login: user.login
        };

        res.json({ message: "Connexion réussie", user: req.session.user });
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

module.exports = { login, logout };