const { ServiceRequest, User } = require('../models');
const { sequelize } = require('../config/database');

// GET - Obtener todas las solicitudes
const getAllServiceRequests = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const where = isAdmin ? {} : { userId: req.user.id };

    const { status, priority, sortBy = 'createdAt', order = 'DESC' } = req.query;

    if (status) where.status = status;
    if (priority) where.priority = priority;

    const requests = await ServiceRequest.findAll({
      where,
      include: [
        { model: User, attributes: ['id', 'name', 'email', 'phone'] }
      ],
      order: [[sortBy, order]]
    });

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot fetch service requests', details: err.message });
  }
};

// GET - Obtener una solicitud por ID
const getServiceRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ServiceRequest.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'name', 'email', 'phone', 'address'] }
      ]
    });

    if (!request) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    if (request.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot fetch service request', details: err.message });
  }
};

// POST - Crear nueva solicitud (ADMIN ONLY - para crear manualmente después de recibir contacto)
const createServiceRequest = async (req, res) => {
  try {
    // Solo admins pueden crear solicitudes manualmente
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin privileges required. Users must contact support directly.' });
    }

    const { userId, serviceType, priority, description, deviceInfo, scheduledDate, estimatedCost, notes } = req.body;

    if (!userId || !serviceType || !description) {
      return res.status(400).json({ error: 'userId, serviceType and description are required' });
    }

    const request = await ServiceRequest.create({
      requestNumber: ServiceRequest.generateRequestNumber(),
      userId,
      serviceType,
      priority: priority || 'medium',
      status: 'pending',
      description,
      deviceInfo: deviceInfo || {},
      scheduledDate: scheduledDate || null,
      estimatedCost: estimatedCost || null,
      notes: notes || null
    });

    const createdRequest = await ServiceRequest.findByPk(request.id, {
      include: [
        { model: User, attributes: ['id', 'name', 'email', 'phone'] }
      ]
    });

    res.status(201).json(createdRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot create service request', details: err.message });
  }
};

// PUT - Actualizar solicitud
const updateServiceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, estimatedCost, actualCost, scheduledDate, notes, technicianNotes } = req.body;

    const request = await ServiceRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    if (req.user.role !== 'admin' && request.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const isAdmin = req.user.role === 'admin';

    // Solo admin puede modificar estos campos
    if (isAdmin) {
      if (status) request.status = status;
      if (priority) request.priority = priority;
      if (estimatedCost !== undefined) request.estimatedCost = estimatedCost;
      if (actualCost !== undefined) request.actualCost = actualCost;
      if (scheduledDate) request.scheduledDate = scheduledDate;
      if (technicianNotes !== undefined) request.technicianNotes = technicianNotes;
    }

    // Cualquiera puede agregar notas
    if (notes !== undefined) request.notes = notes;

    await request.save();

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot update service request', details: err.message });
  }
};

// POST - Completar solicitud (ADMIN ONLY)
const completeServiceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { actualCost, technicianNotes } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin privileges required' });
    }

    const request = await ServiceRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    await request.markAsCompleted(actualCost, technicianNotes);
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot complete service request', details: err.message });
  }
};

// POST - Cancelar solicitud
const cancelServiceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ServiceRequest.findByPk(id);

    if (!request) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    if (request.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    request.status = 'cancelled';
    await request.save();

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot cancel service request', details: err.message });
  }
};

module.exports = {
  getAllServiceRequests,
  getServiceRequestById,
  createServiceRequest,
  updateServiceRequest,
  completeServiceRequest,
  cancelServiceRequest
};
