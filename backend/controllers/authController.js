const User = require('../models/user'); 
const db = require('../config/dbConnect').promise(); 
 
const getClientIP = (req) => { 
    const forwarded = req.headers['x-forwarded-for']; 
    return forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress; 
}; 
 
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
 
        const ipAddress = getClientIP(req); 
        const userAgent = req.headers['user-agent']; 
 
 
        await db.query( 
            "INSERT INTO login_history (user_id, ip_address, user_agent) VALUES (?, ?, ?)", 
            [user.id, ipAddress, userAgent] 
        ); 
 
        req.session.save((err) => { 
            if (err) { 
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
    if (!req.session || !req.session.user) { 
         return res.status(401).json({ message: "Non authentifié" }); 
    } 
    res.json(req.session.user); 
}; 

const resetPassword = async (req, res) => {
    try {
        const { login, oldPassword, newPassword, confirmPassword } = req.body;
        
        // Validation basique
        if (!login || !oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }
        
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Les nouveaux mots de passe ne correspondent pas" });
        }
        
        // Recherche de l'utilisateur par login
        const user = await User.getByLogin(login);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        
        // Vérification de l'ancien mot de passe
        if (oldPassword !== user.password) {
            return res.status(400).json({ message: "Ancien mot de passe incorrect" });
        }
        
        // Mise à jour du mot de passe
        const result = await User.updatePassword(user.id, newPassword);
        if (result.affectedRows === 0) {
            return res.status(500).json({ message: "Échec de la mise à jour du mot de passe" });
        }
        
        res.status(200).json({ success: true, message: "Mot de passe mis à jour avec succès" });
        
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
 
module.exports = { login, logout, CurrentUser, resetPassword };