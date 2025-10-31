const express = require('express');
const router = express.Router();
const timeSlotController = require('../controllers/timeSlotController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

// Rutas públicas/cliente (requieren autenticación)
router.get('/available', authenticate, timeSlotController.getAvailableTimeSlots);

// Rutas de administrador
router.get('/', authenticate, isAdmin, timeSlotController.getAllTimeSlots);
router.post('/', authenticate, isAdmin, timeSlotController.createTimeSlot);
router.post('/bulk', authenticate, isAdmin, timeSlotController.createMultipleTimeSlots);
router.put('/:id', authenticate, isAdmin, timeSlotController.updateTimeSlot);
router.delete('/:id', authenticate, isAdmin, timeSlotController.deleteTimeSlot);

module.exports = router;
