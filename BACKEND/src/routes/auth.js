const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { authenticate } = require('../middleware/authMiddleware');

// ============ RUTAS PÚBLICAS ============

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', validateRegister, authController.register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', validateLogin, authController.login);

// ============ RUTAS PROTEGIDAS ============

// GET /api/auth/me - Obtener perfil del usuario autenticado
router.get('/me', authenticate, authController.getProfile);

// PUT /api/auth/me - Actualizar perfil del usuario autenticado
router.put('/me', authenticate, authController.updateProfile);

// POST /api/auth/refresh - Renovar token
router.post('/refresh', authenticate, authController.refreshToken);

// POST /api/auth/logout - Cerrar sesión (opcional)
router.post('/logout', authenticate, authController.logout);

module.exports = router;