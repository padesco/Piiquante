// on importe multer
const multer = require('multer');

// définition de la constante "MIME_TYPES"
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// on créé un objet de configuration
const storage = multer.diskStorage({
    // on configure la destination des fichiers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // on configure le nom du fichier
  filename: (req, file, callback) => {
    // on remplace les espaces par des tirets
    const name = file.originalname.split(' ').join('-');
    // on enlève tout ce qu'il y a après un point
    const imageName = name.split('.')[0];
    // on définit l'extension avec la constante "MIME_TYPES"
    const extension = MIME_TYPES[file.mimetype];
    // on définit le nouveau nom de l'image
    callback(null, imageName + '_' + Date.now() + '.' + extension);
    //callback(null, `${imageName}_${Date.now()}.${extension}`);
  }
});
// on exporte l'élément "multer" et on indique que nous gérerons que les téléchargements de fichiers image
module.exports = multer({storage: storage}).single('image');