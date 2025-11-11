const logger = require('../utils/logger');

const { User, Order, ServiceRequest } = require('../models');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Listar todos los usuarios (solo admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password', 'verificationToken', 'verificationTokenExpires']
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    logger.error('Error al obtener usuarios:', error);
    res.status(500).json({
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

// Obtener un usuario por ID con estadísticas
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: {
        exclude: ['password', 'verificationToken', 'verificationTokenExpires']
      },
      include: [
        {
          model: Order,
          as: 'orders',
          attributes: ['id', 'totalAmount', 'status', 'createdAt']
        },
        {
          model: ServiceRequest,
          as: 'serviceRequests',
          attributes: ['id', 'status', 'issueDescription', 'createdAt']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Calcular estadísticas
    const stats = {
      totalOrders: user.orders?.length || 0,
      totalSpent: user.orders?.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0) || 0,
      totalServiceRequests: user.serviceRequests?.length || 0
    };

    res.json({ user, stats });
  } catch (error) {
    logger.error('Error al obtener usuario:', error);
    res.status(500).json({
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

// Actualizar rol de usuario
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({
        message: 'Rol inválido. Debe ser "customer" o "admin"'
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // No permitir que el admin se quite sus propios permisos
    if (user.id === req.user.id && role === 'customer') {
      return res.status(400).json({
        message: 'No puedes quitarte tus propios permisos de administrador'
      });
    }

    user.role = role;
    await user.save();

    res.json({
      message: `Rol actualizado a ${role} exitosamente`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Error al actualizar rol:', error);
    res.status(500).json({
      message: 'Error al actualizar rol',
      error: error.message
    });
  }
};

// Bloquear/Desbloquear usuario
const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // No permitir que el admin se bloquee a sí mismo
    if (user.id === req.user.id) {
      return res.status(400).json({
        message: 'No puedes bloquearte a ti mismo'
      });
    }

    user.isBlocked = !user.isBlocked;
    user.blockedAt = user.isBlocked ? new Date() : null;
    user.blockedReason = user.isBlocked ? reason : null;
    await user.save();

    res.json({
      message: user.isBlocked
        ? 'Usuario bloqueado exitosamente'
        : 'Usuario desbloqueado exitosamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked,
        blockedReason: user.blockedReason
      }
    });
  } catch (error) {
    logger.error('Error al bloquear/desbloquear usuario:', error);
    res.status(500).json({
      message: 'Error al bloquear/desbloquear usuario',
      error: error.message
    });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // No permitir que el admin se elimine a sí mismo
    if (user.id === req.user.id) {
      return res.status(400).json({
        message: 'No puedes eliminarte a ti mismo'
      });
    }

    await user.destroy();

    res.json({
      message: 'Usuario eliminado exitosamente',
      deletedUser: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    logger.error('Error al eliminar usuario:', error);
    res.status(500).json({
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};

// Resetear contraseña de usuario
const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Si el usuario usa Google OAuth, no tiene contraseña
    if (user.googleId && !user.password) {
      return res.status(400).json({
        message: 'Este usuario usa Google OAuth y no tiene contraseña'
      });
    }

    // Generar contraseña temporal segura (12 caracteres)
    const tempPassword = crypto.randomBytes(12).toString('base64').slice(0, 12);
    user.password = tempPassword;
    await user.save();

    res.json({
      message: 'Contraseña reseteada exitosamente',
      tempPassword,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    logger.error('Error al resetear contraseña:', error);
    res.status(500).json({
      message: 'Error al resetear contraseña',
      error: error.message
    });
  }
};

// Actualizar información de usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el email ya existe (si se está cambiando)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          message: 'El email ya está en uso'
        });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    await user.save();

    res.json({
      message: 'Usuario actualizado exitosamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Error al actualizar usuario:', error);
    res.status(500).json({
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  toggleBlockUser,
  deleteUser,
  resetUserPassword
};