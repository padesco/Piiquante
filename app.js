// on créé une constante pour importer express avec la commande require
const express = require('express');

// on importe mongoose
const mongoose = require('mongoose');

// importation de helmet
const helmet = require("helmet");

const path = require('path');

// on importe la route "sauces"
const sauceRoutes = require('./routes/sauce');

// on importe la route "user"
const userRoutes = require('./routes/user');

// on appel la méthode express dans une constante "app"
const app = express();

// importation du package pour les variables d'environnement
const dotenv = require("dotenv");
const result = dotenv.config();

// information pour se connecter à la base de donnée mongoDB
mongoose.connect(`${process.env.DB_CONNECT}`,
{ useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware qui intercepte toute les requêtes qui contiennent du JSON pour accèder au body
// même chose que bodyparser
app.use(express.json());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// on rajoute des headers à la réponse pour donner l'autorisation d'utiliser l'API
app.use((req, res, next) => {
    // on prècise que l'on peut accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // on donne l'authorisation d'utiliser certains headers et certaines méthodes
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// on enregistre les routes ici
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// on exporte cette constante pour y accéder depuis les autres fichiers
module.exports = app;