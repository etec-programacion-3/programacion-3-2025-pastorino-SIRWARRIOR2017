const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación y permisos de admin
router.use(authenticateToken);
router.use(requireAdmin);

// Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// Obtener usuario por ID con estadísticas
router.get('/:id', userController.getUserById);

// Actualizar información de usuario
router.put('/:id', userController.updateUser);

// Cambiar rol de usuario (admin/customer)
router.patch('/:id/role', userController.updateUserRole);

// Bloquear/Desbloquear usuario
router.patch('/:id/block', userController.toggleBlockUser);

// Resetear contraseña de usuario
router.post('/:id/reset-password', userController.resetUserPassword);

// Eliminar usuario
router.delete('/:id', userController.deleteUser);

module.exports = router;
