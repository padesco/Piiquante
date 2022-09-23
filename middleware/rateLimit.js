// importation du package "rate-limit" pour limiter le nombre de requête sur une page
const rateLimit = require('express-rate-limit');

// on créé la constante "connexionLimiter" pour limiter le nombre de tentative de connexion sur la page login et signup
const connexionLimiter = rateLimit({
  // on définit le temps de blocage à 1min
    windowMs: 1 * 60 * 1000, // 1 minute
    // on définie le nombre de requête à 5
    max: 5, // limit each IP to 5 requests per windowMs
    // message si il y a eu trop de requête
    handler: function (req, res) {
        return res.status(429).json({
          error: 'You sent too many requests. Please wait a minute then try again'
        })
    }
})

// on exporte la constante "connexionLimiter" pour pouvoir l'utiliser
module.exports = connexionLimiter;