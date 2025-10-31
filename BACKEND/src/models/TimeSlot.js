const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TimeSlot = sequelize.define('TimeSlot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Fecha del turno (YYYY-MM-DD)'
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: 'Hora de inicio (HH:MM:SS)'
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: 'Hora de fin (HH:MM:SS)'
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Si el turno está disponible para reservar'
  },
  maxCapacity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Cantidad máxima de servicios en este turno'
  },
  currentBookings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Cantidad actual de reservas en este turno'
  },
  technicianNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notas del técnico sobre este turno'
  }
}, {
  tableName: 'time_slots',
  timestamps: true
});

module.exports = TimeSlot;
