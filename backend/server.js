const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const passport = require('passport'); // Pour le module officiel
require('./config/passport');  
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const groupeRoutes = require('./routes/groupeRoutes');
const userRoutes = require('./routes/userRoutes');
const modelRoutes = require('./routes/modelRoutes');
const missionRoutes = require('./routes/missionRoutes');
const contactGroupeRoutes = require('./routes/contactGroupeRoutes');
const puceRoutes = require('./routes/puceRoutes');
//const openaiRoutes= require('./routes/openaiRoutes');
const smsRoutes = require('./routes/smsRoutes');
const claudRoutes= require('./routes/claudRoutes');
const siteRoutes = require('./routes/siteRoutes');




const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session); // pour stocker les sessions en DB
const app = express();

// Configurer le stockage des sessions dans MySQL
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

app.set('trust proxy', 1);

// Middleware session
app.use(session({
  secret: 'JWT_SECRET',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { secure: false, httpOnly: false, sameSite: 'lax', maxAge: 1000 * 60 * 60 }
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin === 'null') {
      return callback(null, true); // Allow file:// and Cordova apps
    }
    return callback(null, origin); // Also allow other origins
  },
  credentials: true,
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
}));

// Preflight support
app.options('*', cors());



app.use('/api', authRoutes);
app.use('/api', contactRoutes);
app.use('/api', groupeRoutes);
app.use('/api', userRoutes);
app.use('/api', modelRoutes);
app.use('/contact-groupe', contactGroupeRoutes);
app.use('/api', missionRoutes);
app.use('/api', puceRoutes);
app.use('/api', smsRoutes);
//app.use('/api', openaiRoutes);
app.use('/api', claudRoutes)
app.use('/api', siteRoutes);






const port = 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
