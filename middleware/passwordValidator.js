// on importe passwordValidator pour définir les critères du password
const passwordValidator = require('password-validator');

// Create a schema
let passwordSchema = new passwordValidator();

// définition des critères du schema pour le mot de passe
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123', 'Password12', 'Azerty12', 'Azerty123']); // Blacklist these values

// on exporte le module et on inclu une condition 
module.exports = (req, res, next) => {
    // si le password répond aux critères on continu
    if(passwordSchema.validate(req.body.password)){
        next();
    } else { // sinon on bloque et message d'erreur
        return res.status(400).json({error : `Password must include ${passwordSchema.validate('req.body.password', { list: true})}` })
    }
};