const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const passport = require('passport'); // Pour le module officiel
require('./config/passport');  
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const groupeRoutes = require('./routes/groupeRoutes');
const userRoutes = require('./routes/userRoutes');
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

// Middleware session
app.use(session({
  secret: 'JWT_SECRET',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { secure: false, httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 }
}));



app.use(passport.initialize());
app.use(passport.session());
app.set('trust proxy', 1);
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:4200', // Allow only your Angular frontend
  credentials: true, // Allow credentials (cookies) to be sent
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
}));


app.use('/api', authRoutes);
app.use('/api', contactRoutes);
app.use('/api', groupeRoutes);
app.use('/api', userRoutes);




const port = 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
