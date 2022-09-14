// on importe "jsonwebtoken"
const jwt = require('jsonwebtoken');

// on exporte une fonction
module.exports = (req, res, next) => {
    try {
        // on récupère le header et on sépare "bearer" pour récupérer seulement le token
        const token = req.headers.authorization.split(' ')[1];
        // on utilise "verify" de "jwt" pour décoder le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // on récupère le userId
        const userId = decodedToken.userId;
        // on rajoute un objet pour stocker le userId
        req.auth = {
            userId: userId
        };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};