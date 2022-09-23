// importation de bcrypt pour hasher le password
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// importation de crypto-js pour chiffrer l'email
const cryptoJS = require('crypto-js');

// importer le package pour utiliser les variables d'environnement
const dotenv = require("dotenv");
const result = dotenv.config();

// on importe le model User
const User = require('../models/User');

// fonction signup pour les nouveaux utilisateurs
exports.signup = (req, res, next) => {
    // on définit la constante "emailCrypto" et on utilise la méthode "HmacSHA256" de crypto pour chiffrer l'email
    const emailCrypto = cryptoJS.HmacSHA256(req.body.email, `${process.env.DB_CRYPTO}`).toString()
    // on utilise les variables d'environnement pour ne pas montrer le nombre de tour utilisé pour le salage
    const saltRounds = parseInt(process.env.DB_SALTROUNDS)
    // on appelle la fonction de hachage de "bcrypt" dans notre mdp et lui demandons de "saler" le mot de passe un certains nombre de fois
    bcrypt.hash(req.body.password, saltRounds)
      .then(hash => {
        // on créé un utilisateur
        const user = new User({
          email: emailCrypto,
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
    // on définit la constante "emailCrypto" et on utilise la méthode "HmacSHA256" de crypto pour chiffrer l'email
    const emailCrypto = cryptoJS.HmacSHA256(req.body.email, `${process.env.DB_CRYPTO}`).toString()
    // on va utiliser notre modèle mongoose pour vérifier l'email entré avec la base de données
    User.findOne({ email: emailCrypto })
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
                                    // on utilise une chaîne secrète exporté depuis la variable d'environnement
                                    `${process.env.DB_TOKEN}`,
                                    // on définie la durée de validité du token à 12h
                                    { expiresIn: '12h' }
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