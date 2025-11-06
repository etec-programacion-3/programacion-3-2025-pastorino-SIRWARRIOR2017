const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token: user not found' });
    }

    // Verificar si el usuario está bloqueado
    if (user.isBlocked) {
      return res.status(403).json({
        error: 'Account blocked',
        message: 'Tu cuenta ha sido bloqueada. Contacta al administrador.',
        reason: user.blockedReason
      });
    }

    req.user = user; // attach full user instance
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token', details: err.message });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  // check role field (expects role === 'admin')
  if (req.user.role && req.user.role.toLowerCase() === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Admin privileges required' });
};

module.exports = {
  authenticate,
  authenticateToken: authenticate, // Alias
  isAdmin,
  requireAdmin: isAdmin // Alias
};