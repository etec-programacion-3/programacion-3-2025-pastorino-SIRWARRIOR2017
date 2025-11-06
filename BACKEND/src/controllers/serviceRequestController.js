const { ServiceRequest, User, TimeSlot } = require('../models');
const { sequelize } = require('../config/database');
const timeSlotController = require('./timeSlotController');

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
        { model: User, attributes: ['id', 'name', 'email', 'phone'] },
        { model: TimeSlot, attributes: ['id', 'date', 'startTime', 'endTime'] }
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
        { model: User, attributes: ['id', 'name', 'email', 'phone', 'address'] },
        { model: TimeSlot, attributes: ['id', 'date', 'startTime', 'endTime'] }
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

// POST - Crear nueva solicitud
const createServiceRequest = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { serviceType, priority, description, deviceInfo, timeSlotId } = req.body;

    if (!serviceType || !description) {
      await t.rollback();
      return res.status(400).json({ error: 'serviceType and description are required' });
    }

    if (!timeSlotId) {
      await t.rollback();
      return res.status(400).json({ error: 'Debes seleccionar un turno disponible' });
    }

    // Reservar el turno
    const timeSlot = await timeSlotController.bookTimeSlot(timeSlotId, t);

    const request = await ServiceRequest.create({
      requestNumber: ServiceRequest.generateRequestNumber(),
      userId,
      serviceType,
      priority: priority || 'medium',
      status: 'pending',
      description,
      deviceInfo: deviceInfo || {},
      timeSlotId,
      scheduledDate: new Date(`${timeSlot.date}T${timeSlot.startTime}`)
    }, { transaction: t });

    await t.commit();

    const createdRequest = await ServiceRequest.findByPk(request.id, {
      include: [
        { model: User, attributes: ['id', 'name', 'email', 'phone'] },
        { model: TimeSlot, attributes: ['id', 'date', 'startTime', 'endTime'] }
      ]
    });

    res.status(201).json(createdRequest);
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ error: 'Cannot create service request', details: err.message });
  }
};

// PUT - Actualizar solicitud
const updateServiceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, estimatedCost, scheduledDate, notes } = req.body;

    const request = await ServiceRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    if (req.user.role !== 'admin' && request.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const isAdmin = req.user.role === 'admin';

    await request.update({
      status: (isAdmin && status) ? status : request.status,
      priority: (isAdmin && priority) ? priority : request.priority,
      estimatedCost: (isAdmin && estimatedCost) ? estimatedCost : request.estimatedCost,
      scheduledDate: (isAdmin && scheduledDate) ? scheduledDate : request.scheduledDate,
      notes: notes || request.notes
    });

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
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const request = await ServiceRequest.findByPk(id, { transaction: t });

    if (!request) {
      await t.rollback();
      return res.status(404).json({ error: 'Service request not found' });
    }

    if (request.userId !== req.user.id && req.user.role !== 'admin') {
      await t.rollback();
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Liberar el turno si tenía uno reservado
    if (request.timeSlotId) {
      await timeSlotController.releaseTimeSlot(request.timeSlotId, t);
    }

    request.status = 'cancelled';
    await request.save({ transaction: t });

    await t.commit();

    res.json(request);
  } catch (err) {
    await t.rollback();
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