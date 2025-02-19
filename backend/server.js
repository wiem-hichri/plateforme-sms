const express = require('express');
const bodyParser = require('body-parser');
const passport = require('./config/passport');
const contactRoutes = require('./routes/contactRoutes');
const groupeRoutes = require('./routes/groupeRoutes');
const userRoutes = require('./routes/userRoutes');

const cors = require('cors'); // 🛑 Make sure you installed CORS




const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors()); // ✅ Enables CORS for all origins
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); // ✅ Allow only Angular frontend
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use('/api', contactRoutes);
app.use('/api', groupeRoutes);
app.use('/api', userRoutes);




const port = 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
