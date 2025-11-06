const { TimeSlot, ServiceRequest } = require('../models');
const { Op } = require('sequelize');

const timeSlotController = {
  // Obtener todos los turnos (admin)
  getAllTimeSlots: async (req, res) => {
    try {
      const { startDate, endDate, isAvailable } = req.query;

      const where = {};

      if (startDate && endDate) {
        where.date = {
          [Op.between]: [startDate, endDate]
        };
      }

      if (isAvailable !== undefined) {
        where.isAvailable = isAvailable === 'true';
      }

      const timeSlots = await TimeSlot.findAll({
        where,
        include: [{
          model: ServiceRequest,
          attributes: ['id', 'requestNumber', 'status']
        }],
        order: [['date', 'ASC'], ['startTime', 'ASC']]
      });

      res.json(timeSlots);
    } catch (error) {
      console.error('Error al obtener turnos:', error);
      res.status(500).json({
        message: 'Error al obtener los turnos',
        error: error.message
      });
    }
  },

  // Obtener turnos disponibles (cliente)
  getAvailableTimeSlots: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const where = {
        isAvailable: true,
        date: {
          [Op.gte]: startDate || today
        }
      };

      if (endDate) {
        where.date[Op.lte] = endDate;
      }

      // Solo mostrar slots que aún tienen capacidad
      const timeSlots = await TimeSlot.findAll({
        where,
        attributes: ['id', 'date', 'startTime', 'endTime', 'maxCapacity', 'currentBookings'],
        order: [['date', 'ASC'], ['startTime', 'ASC']]
      });

      // Filtrar solo los que tienen espacio disponible
      const availableSlots = timeSlots.filter(slot =>
        slot.currentBookings < slot.maxCapacity
      );

      res.json(availableSlots);
    } catch (error) {
      console.error('Error al obtener turnos disponibles:', error);
      res.status(500).json({
        message: 'Error al obtener turnos disponibles',
        error: error.message
      });
    }
  },

  // Crear turno (admin)
  createTimeSlot: async (req, res) => {
    try {
      const { date, startTime, endTime, maxCapacity, technicianNotes } = req.body;

      // Validar que la fecha no sea pasada
      const slotDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (slotDate < today) {
        return res.status(400).json({
          message: 'No se puede crear un turno en una fecha pasada'
        });
      }

      // Verificar si ya existe un turno en ese horario
      const existingSlot = await TimeSlot.findOne({
        where: { date, startTime, endTime }
      });

      if (existingSlot) {
        return res.status(400).json({
          message: 'Ya existe un turno en este horario'
        });
      }

      const timeSlot = await TimeSlot.create({
        date,
        startTime,
        endTime,
        maxCapacity: maxCapacity || 1,
        technicianNotes
      });

      res.status(201).json({
        message: 'Turno creado exitosamente',
        timeSlot
      });
    } catch (error) {
      console.error('Error al crear turno:', error);
      res.status(500).json({
        message: 'Error al crear el turno',
        error: error.message
      });
    }
  },

  // Crear múltiples turnos (admin) - útil para configurar una semana completa
  createMultipleTimeSlots: async (req, res) => {
    try {
      const { startDate, endDate, timeRanges, maxCapacity, excludeWeekends } = req.body;

      // timeRanges: [{ startTime: '09:00', endTime: '10:00' }, ...]

      const start = new Date(startDate);
      const end = new Date(endDate);
      const slots = [];

      // Iterar por cada día
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dayOfWeek = date.getDay();

        // Saltar fines de semana si está configurado
        if (excludeWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
          continue;
        }

        // Crear un slot por cada rango horario
        for (const range of timeRanges) {
          slots.push({
            date: date.toISOString().split('T')[0],
            startTime: range.startTime,
            endTime: range.endTime,
            maxCapacity: maxCapacity || 1,
            isAvailable: true,
            currentBookings: 0
          });
        }
      }

      const createdSlots = await TimeSlot.bulkCreate(slots, {
        ignoreDuplicates: true
      });

      res.status(201).json({
        message: `${createdSlots.length} turnos creados exitosamente`,
        count: createdSlots.length
      });
    } catch (error) {
      console.error('Error al crear múltiples turnos:', error);
      res.status(500).json({
        message: 'Error al crear los turnos',
        error: error.message
      });
    }
  },

  // Actualizar turno (admin)
  updateTimeSlot: async (req, res) => {
    try {
      const { id } = req.params;
      const { date, startTime, endTime, isAvailable, maxCapacity, technicianNotes } = req.body;

      const timeSlot = await TimeSlot.findByPk(id);

      if (!timeSlot) {
        return res.status(404).json({ message: 'Turno no encontrado' });
      }

      // Si hay reservas, no permitir reducir la capacidad por debajo de las reservas actuales
      if (maxCapacity && maxCapacity < timeSlot.currentBookings) {
        return res.status(400).json({
          message: `No se puede reducir la capacidad. Ya hay ${timeSlot.currentBookings} reservas`
        });
      }

      await timeSlot.update({
        date: date || timeSlot.date,
        startTime: startTime || timeSlot.startTime,
        endTime: endTime || timeSlot.endTime,
        isAvailable: isAvailable !== undefined ? isAvailable : timeSlot.isAvailable,
        maxCapacity: maxCapacity || timeSlot.maxCapacity,
        technicianNotes: technicianNotes !== undefined ? technicianNotes : timeSlot.technicianNotes
      });

      res.json({
        message: 'Turno actualizado exitosamente',
        timeSlot
      });
    } catch (error) {
      console.error('Error al actualizar turno:', error);
      res.status(500).json({
        message: 'Error al actualizar el turno',
        error: error.message
      });
    }
  },

  // Eliminar turno (admin)
  deleteTimeSlot: async (req, res) => {
    try {
      const { id } = req.params;

      const timeSlot = await TimeSlot.findByPk(id, {
        include: [ServiceRequest]
      });

      if (!timeSlot) {
        return res.status(404).json({ message: 'Turno no encontrado' });
      }

      // No permitir eliminar si tiene reservas activas
      if (timeSlot.currentBookings > 0) {
        return res.status(400).json({
          message: 'No se puede eliminar un turno con reservas activas. Cancela las reservas primero.'
        });
      }

      await timeSlot.destroy();

      res.json({
        message: 'Turno eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar turno:', error);
      res.status(500).json({
        message: 'Error al eliminar el turno',
        error: error.message
      });
    }
  },

  // Reservar un turno (cliente) - se llama desde serviceRequestController
  bookTimeSlot: async (timeSlotId, transaction) => {
    const timeSlot = await TimeSlot.findByPk(timeSlotId, { transaction });

    if (!timeSlot) {
      throw new Error('Turno no encontrado');
    }

    if (!timeSlot.isAvailable) {
      throw new Error('Este turno no está disponible');
    }

    if (timeSlot.currentBookings >= timeSlot.maxCapacity) {
      throw new Error('Este turno ya está completo');
    }

    // Incrementar el contador de reservas
    await timeSlot.update({
      currentBookings: timeSlot.currentBookings + 1
    }, { transaction });

    return timeSlot;
  },

  // Liberar un turno (cuando se cancela una solicitud)
  releaseTimeSlot: async (timeSlotId, transaction) => {
    const timeSlot = await TimeSlot.findByPk(timeSlotId, { transaction });

    if (!timeSlot) {
      return;
    }

    if (timeSlot.currentBookings > 0) {
      await timeSlot.update({
        currentBookings: timeSlot.currentBookings - 1
      }, { transaction });
    }
  }
};

module.exports = timeSlotController;
