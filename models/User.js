// on importe mongoose
const mongoose = require('mongoose');

// on importe le package uniqueValidator pour s'assurer qu'un email soit utilisé qu'une seule fois
const uniqueValidator = require('mongoose-unique-validator');

// on créé notre schema
const userSchema = mongoose.Schema({
// email de type string dans un champ requis avec un email unique par utilisateur
  email: { type: String, required: true, unique: true },
  // password de type string dans un champ requis
  password: { type: String, required: true }
});

// avec mongoose-unique-validator en plug-in, on s'assure que 2 utilisateurs ne peuvent pas partager la même adresse e-mail
userSchema.plugin(uniqueValidator);

// exportation du shema pour pouvoir l'utiliser
module.exports = mongoose.model('User', userSchema);