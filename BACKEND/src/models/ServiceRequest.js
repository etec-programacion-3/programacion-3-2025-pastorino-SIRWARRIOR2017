const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ServiceRequest = sequelize.define('ServiceRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  requestNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  serviceType: {
    type: DataTypes.ENUM('maintenance', 'repair', 'installation', 'consultation', 'upgrade'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_review', 'approved', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 1000]
    }
  },
  deviceInfo: {
    type: DataTypes.JSON, // Para almacenar información del dispositivo/PC
    allowNull: true,
    defaultValue: {}
  },
  estimatedCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  actualCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  technicianNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});

// Método estático para generar número de solicitud único
ServiceRequest.generateRequestNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SRV-${timestamp}-${random}`;
};

// Método de instancia para verificar si está completada
ServiceRequest.prototype.isCompleted = function() {
  return this.status === 'completed';
};

// Método de instancia para marcar como completada
ServiceRequest.prototype.markAsCompleted = async function(actualCost = null, technicianNotes = null) {
  this.status = 'completed';
  this.completedDate = new Date();
  if (actualCost !== null) this.actualCost = actualCost;
  if (technicianNotes) this.technicianNotes = technicianNotes;
  await this.save();
  return this;
};

module.exports = ServiceRequest;