const jwt = require('jsonwebtoken');
const { User } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = payload; // payload should contain at least user id
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    // Se acepta tanto una propiedad boolean isAdmin como un role === 'admin'
    if (!user.isAdmin && user.role !== 'admin') return res.status(403).json({ error: 'Requiere permisos de administrador' });
    next();
  } catch (err) {
    res.status(500).json({ error: 'Error en comprobación de permisos' });
  }
};

module.exports = { authenticate, isAdmin };