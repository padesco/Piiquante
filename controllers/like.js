const Sauce = require('../models/Sauce');

exports.likeSauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...req.body.sauce,
    } : { ...req.body };
    console.log(req.body);
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
                Sauce.updateOne({ _id: req.params.id}, {
                    ...sauceObject, like: req.params.like,
                    // l'opérateur $inc accepte les valeurs positives et négatives
                    //$inc: {like: 1},
                    // l'opérateur $push ajoute le champ de tableau avec la valeur comme élément
                    //$push: {usersLiked: req.body.userId}
                })
                .then(() => res.status(200).json({message : 'Objet liké!'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch((error) => {
            res.status(404).json({ error });
        });
};