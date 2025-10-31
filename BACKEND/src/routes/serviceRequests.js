const express = require('express');
const router = express.Router();
const serviceRequestController = require('../controllers/serviceRequestController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authenticate);

// GET /api/service-requests - Obtener solicitudes
router.get('/', serviceRequestController.getAllServiceRequests);

// GET /api/service-requests/:id - Obtener detalle
router.get('/:id', serviceRequestController.getServiceRequestById);

// POST /api/service-requests - Crear solicitud
router.post('/', serviceRequestController.createServiceRequest);

// PUT /api/service-requests/:id - Actualizar solicitud
router.put('/:id', serviceRequestController.updateServiceRequest);

// POST /api/service-requests/:id/complete - Completar (ADMIN)
router.post('/:id/complete', isAdmin, serviceRequestController.completeServiceRequest);

// POST /api/service-requests/:id/cancel - Cancelar
router.post('/:id/cancel', serviceRequestController.cancelServiceRequest);

module.exports = router;