const express = require('express');
const router = express.Router();
const siteSettingsController = require('../controllers/siteSettingsController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const { siteUpload } = require('../middleware/upload');

// Ruta pública para obtener configuración
router.get('/', siteSettingsController.getSettings);

// Rutas protegidas (solo admin)
router.put('/', authenticateToken, isAdmin, siteSettingsController.updateSettings);

router.post(
  '/logo',
  authenticateToken,
  isAdmin,
  siteUpload.single('logo'),
  siteSettingsController.uploadLogo
);

module.exports = router;
