// importation de bcrypt pour hasher le password
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// importer le package pour utiliser les variables d'environnement
const dotenv = require("dotenv");
const result = dotenv.config();

// on importe le model User
const User = require('../models/User');

// fonction signup pour les nouveaux utilisateurs
exports.signup = (req, res, next) => {
    // on appelle la fonction de hachage de "bcrypt" dans notre mdp et lui demandons de "saler" le mot de passe 10 fois
    bcrypt.hash(req.body.password, `${process.env.DB_NUMBER_HASH}`)
      .then(hash => {
        // on créé un utilisateur
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // on enregistre l'utilisateur dans la base de données
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

// fonction login pour connecter les utilisateurs existant
exports.login = (req, res, next) => {
    // on va utiliser notre modèle mongoose pour vérifier l'email entré avec la base de données
    User.findOne({ email: req.body.email })
        .then(user => {
            // si l'email n'est pas dans la base de données erreur 401 Unauthorized
            if (user === null) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            } else {
            // sinon on utilise la fonction "compare" de "bcrypt" pour comparer le mdp entré avec le hash de la base de données
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        // si le mdp ne correspond pas erreur 401 unauthorized
                        if (!valid) {
                            res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                        } else {
                        // sinon nous renvoyons une réponse 200 contenant l'ID utilisateur et le "token"
                            res.status(200).json({
                                userId: user._id,
                                // on utilise la fonction "sign" de "jsonwebtoken" pour chiffrer un nouveau token
                                token: jwt.sign(
                                    { userId: user._id },
                                    // on utilise une chaîne secrète de développement temporaire
                                    `${process.env.DB_TOKEN}`,
                                    // on définie la durée de validité du token à 24h
                                    { expiresIn: '1h' }
                                )
                            });
                        }  
                    })
                    .catch(error => {
                        res.status(500).json({ error });
                    })
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        })
 };