// on a besoin d'"express" pour créé le router
const express = require('express');
const router = express.Router();

// il nous faut le controllers pour associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user');

// création de 2 routes "POST" pour signup et login
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// on exporte le router pour app.js
module.exports = router;