// on a besoin d'"express" pour créé le router
const express = require('express');
const router = express.Router();

// importation des middlewares
const emailValidator = require('../middleware/emailValidator')
const passwordValidator = require('../middleware/passwordValidator');
const connexionLimiter = require('../middleware/rateLimit');

// il nous faut le controllers pour associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user');

// création de 2 routes "POST" pour les endpoints "signup" et "login" ainsi que les différents middleware et controleur à parcourir
router.post('/signup', emailValidator, passwordValidator, connexionLimiter, userCtrl.signup);
router.post('/login',connexionLimiter, userCtrl.login);

// on exporte le router pour app.js
module.exports = router;