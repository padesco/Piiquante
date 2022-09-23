// importation du schema "Sauce"
const Sauce = require('../models/Sauce');

// fonction pour gérer les likes
exports.likeSauce = (req, res, next) => {
    // on cherche la sauce correspondante dans la base de donnée en comparant les id
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            // utilisation de la méthode switch pour parcourir différent cas de figures
            switch (req.body.like) {
                // premier cas avec like = 1
                case 1:
                    // si l'utilisateur n'est pas déjà présent dans le tableau des likes alors on ajoute son userId
                    if (!sauce.usersLiked.includes(req.body.userId)) {
                        // mise à jour de Sauce dans la base de donnée
                        Sauce.updateOne({_id: req.params.id},
                            {
                                // utilisation des opérateurs $inc et $push de mongoDB
                                $inc: {likes: 1},
                                $push: {usersLiked: req.body.userId}
                            })
                            .then(() => res.status(201).json({message : 'Objet like 1!'}))
                            .catch(error => res.status(400).json({ error }));
                    }
                break;

                // deuxième cas avec like = -1
                case -1:
                    // si l'utilisateur n'est pas déjà présent dans le tableau des dislikes alors on ajoute son userId
                    if (!sauce.usersDisliked.includes(req.body.userId)) {
                        // mise à jour de Sauce dans la base de donnée
                        Sauce.updateOne({_id: req.params.id},
                            {
                                // utilisation des opérateurs $inc et $push de mongoDB
                                $inc: {dislikes: 1},
                                $push: {usersDisliked: req.body.userId}
                            })
                            .then(() => res.status(201).json({message : 'Objet dislike 1!'}))
                            .catch(error => res.status(400).json({ error }));
                    }
                break;

                case 0:
                    // si l'utilisateur est déjà présent dans le tableau des likes alors on enlève son userId
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        // mise à jour de Sauce dans la base de donnée
                        Sauce.updateOne({_id: req.params.id},
                            {
                                // utilisation des opérateurs $inc et $pull de mongoDB
                                $inc: {likes: -1},
                                $pull: {usersLiked: req.body.userId}
                            })
                            .then(() => res.status(201).json({message : 'Objet like 0!'}))
                            .catch(error => res.status(400).json({ error }));
                    // si l'utilisateur est déjà présent dans le tableau des dislikes alors on enlève son userId   
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        // mise à jour de Sauce dans la base de donnée
                        Sauce.updateOne({_id: req.params.id},
                            {
                                // utilisation des opérateurs $inc et $pull de mongoDB
                                $inc: {dislikes: -1},
                                $pull: {usersDisliked: req.body.userId}
                            })
                            .then(() => res.status(201).json({message : 'Objet dislike 0!'}))
                            .catch(error => res.status(400).json({ error }));
                    }
                break;
            }
        })
        .catch((error) => {res.status(404).json({ error });
    });
};