// importation de mongoose
const mongoose = require('mongoose');

// on utilise la fonction "schema" disponible grâce à "mongoose" pour construire le modèle 'Sauce'
// définition des du type de donnée et spécification si la donnée est obligatoirement requise
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] }
});

// on exporte le shema pour pouvoir le réutiliser
module.exports = mongoose.model('Sauce', sauceSchema);