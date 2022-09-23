const express = require('express');
const router = express.Router();

// on importe le middleware "auth"
const auth = require('../middleware/auth');
// on importe le middleware "multer-config"
const multer = require('../middleware/multer-config');

// importation du controleur "sauce"
const sauceCtrl = require('../controllers/sauce');
// importation du controleur "like"
const likeCtrl = require ('../controllers/like');

// on définie le type de requête pour les différents endpoints ainsi que le chemin à parcourir avec les middleware et controleurs
router.post('/:id/like', auth);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/:id/like', auth, likeCtrl.likeSauce);

module.exports = router;