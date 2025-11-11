const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegurar que los directorios de uploads existen
const productsDir = path.join(__dirname, '../../public/uploads/products');
const siteDir = path.join(__dirname, '../../public/uploads/site');

if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

if (!fs.existsSync(siteDir)) {
  fs.mkdirSync(siteDir, { recursive: true });
}

// Configuración de almacenamiento para productos
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, productsDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
  }
});

// Configuración de almacenamiento para archivos del sitio (logo, favicon)
const siteStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, siteDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
  }
});

// Filtro de archivos (solo imágenes)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|ico|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) ||
                   file.mimetype === 'image/x-icon' ||
                   file.mimetype === 'image/vnd.microsoft.icon' ||
                   file.mimetype === 'image/svg+xml';

  if (mimetype || extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp, ico, svg)'));
  }
};

// Configuración de multer para productos
const productUpload = multer({
  storage: productStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  },
  fileFilter: fileFilter
});

// Configuración de multer para archivos del sitio
const siteUpload = multer({
  storage: siteStorage,
  limits: {
    fileSize: 2 * 1024 * 1024 // Límite de 2MB para logos/favicons
  },
  fileFilter: fileFilter
});

// Exportar ambos
module.exports = productUpload;
module.exports.siteUpload = siteUpload;
