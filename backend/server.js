const express = require('express');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contactRoutes');
const groupeRoutes = require('./routes/groupeRoutes');



const app = express();
app.use(bodyParser.json());


app.use('/api', contactRoutes);
app.use('/api', groupeRoutes);


const port = 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
