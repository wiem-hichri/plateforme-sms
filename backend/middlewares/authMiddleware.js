// Vérifier si l'utilisateur est connecté
const isAuthentificated = (req, res, next) => {
    
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ message: "Non authentifié" });
};

// Vérifier le rôle utilisateur
const checkRole = (...roles) => {
    return (req, res, next) => {
        // Vérifie si l'utilisateur est authentifié
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Non authentifié" });
        }

        // Vérifie si le rôle de l'utilisateur est autorisé
        if (!roles.includes(req.session.user.role)) {
            return res.status(403).json({ message: "Accès interdit" });
        }

        // Si l'utilisateur est authentifié et a le rôle approprié, on continue
        next();
    };
};

module.exports = { isAuthentificated, checkRole };
