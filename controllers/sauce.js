// importation du modèle "Sauce"
const Sauce = require('../models/Sauce');
// importation du package fs de mongoDB pour accéder aux fichiers du serveur
const fs = require('fs');

// fonction pour créer une sauce
exports.createSauce = (req, res, next) => {
    // on récupère le corps de la requête dans "sauceObject"
    const sauceObject = JSON.parse(req.body.sauce);
    // on supprime l'élément _id
    delete sauceObject._id;
    // on créé l'instance sauce avec "sauceObject", le userId et l'imageUrl avec le chemin correpondant
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    });
    // on enregistre l'objet dans la base de donnée
    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};

// fonction pour modifier une sauce
exports.modifySauce = (req, res, next) => {
    // on définit "sauceObject" avec les 2 cas possible
    const sauceObject = req.file ? {
        ...req.body.sauce,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    // on récupère la sauce sélectionné en comparant les id
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            // si userId est différent du userId qui a créé le post "error not authorized"
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
                // si une image est envoyé dans la base de donnée elle est directement retiré
                const filename = sauceObject.imageUrl.split("/images/")[1];
                // utilisation du model "fs" de mongodb pour accéder à la base de donnée
                fs.unlink(`images/${filename}`, (error) => {
                    if (error) throw error;
                })
            } else { // sinon on permet la modification du contenu du post
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    // on récupère la sauce sélectionné
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            // on contrôle si le userId est différent du userId de l'utilisateur qui a créé le post alors "error not authorized"
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else { // sinon on supprime le post ainsi que l'image stocké
                const filename = sauce.imageUrl.split('/images/')[1];
                // utilisation du model "fs" de mongodb pour accéder à la base de donnée
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
};

// fonction pour pouvoir accéder à une sauce en particulier de la base de donnée
exports.getOneSauce = (req, res, next) => {
    // on compare l'id pour trouver la sauce sélectionné
    Sauce.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
};

// fonction pour pouvoir récupérer toute les sauces de la base de donnée
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
};