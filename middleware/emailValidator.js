// importation du package "email-validator" pour s'assurer que le champ soit renseigné avec un email
const emailValidator = require('email-validator');

// on exporte le module et on inclu une condition 
module.exports = (req, res, next) => {
    // si le password répond aux critères on continu
    if(emailValidator.validate(req.body.email)){
        next();
    } else { // sinon on bloque et message d'erreur
        return res.status(400).json({error})
    }
};