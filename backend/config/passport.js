const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../config/dbConnect'); // connexion MySQL
const { login } = require('../controllers/userController');

passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password'
}, async (login, password, done) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE login = ?', [login]);
        if (rows.length === 0) return done(null, false, { message: 'Login incorrect' });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return done(null, false, { message: 'Mot de passe incorrect' });

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Sérialisation pour stocker l'ID en session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Désérialisation pour récupérer les infos utilisateur à partir de l'ID
passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        done(null, rows[0]);
    } catch (err) {
        done(err);
    }
});
