// Vérifier si l'utilisateur est connecté
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: 'Non authentifié' });
};

// Vérifier le rôle utilisateur
const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.isAuthenticated() || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Accès interdit' });
        }
        next();
    };
};

module.exports = { isAuthenticated, checkRole };























/*const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Accès refusé" });
        }
        next();
    };
};

module.exports = { checkRole };*/