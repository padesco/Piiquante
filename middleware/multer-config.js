// on importe multer
const multer = require('multer');

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
    const name = file.originalname.split(' ').join('-');
    const imageName = name.split('.')[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, imageName + '_' + Date.now() + '.' + extension);
    //callback(null, `${imageName}_${Date.now()}.${extension}`);
  }
});
// on exporte l'élément "multer" et on indique que nous gérerons que les téléchargements de fichiers image
module.exports = multer({storage}).single('image');