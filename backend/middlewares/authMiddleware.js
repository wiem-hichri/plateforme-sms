// Vérifier si l'utilisateur est connecté
const isAuthentificated = (req, res, next) => {
    
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ message: "Non authentifié" });
};


const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Non authentifié" });
        }

        if (!roles.includes(req.session.user.role)) {
            return res.status(403).json({ message: "Accès interdit" });
        }

        next();
    };
};

module.exports = { isAuthentificated, checkRole };
