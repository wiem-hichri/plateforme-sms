const express = require('express');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contactRoutes');
const groupeRoutes = require('./routes/groupeRoutes');
const userRoutes = require('./routes/userRoutes');



const app = express();
app.use(bodyParser.json());


app.use('/api', contactRoutes);
app.use('/api', groupeRoutes);
app.use('/api', userRoutes);



const port = 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
