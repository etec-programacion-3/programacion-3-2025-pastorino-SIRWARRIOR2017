const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) return res.status(400).json({ error: 'Faltan datos' });
      // El hook en el modelo se encargará de hashear la contraseña
      const user = await User.create({ name, email, password });
      res.status(201).json({ message: 'Usuario creado', user: user.toPublicJSON() });
    } catch (err) {
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Faltan datos' });
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
      const valid = await user.validatePassword(password);
      if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });
      const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }
  ,
  getProfile: async (req, res) => {
    try {
      // Si el middleware authenticate puso el usuario en req.user, lo devolvemos
      if (!req.user) return res.status(401).json({ error: 'No autenticado' });
      const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ user });
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener perfil' });
    }
  },
  updateProfile: async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'No autenticado' });
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      // Actualizamos campos permitidos
      const { username, email } = req.body;
      if (username) user.username = username;
      if (email) user.email = email;
      await user.save();
      res.json({ message: 'Perfil actualizado', user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
      res.status(500).json({ error: 'Error al actualizar perfil' });
    }
  },
  refreshToken: async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'No autenticado' });
      const token = jwt.sign({ id: req.user.id, username: req.user.username }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: 'Error al renovar token' });
    }
  },
  logout: async (req, res) => {
    // En este ejemplo no hay token blacklist; devolvemos 200 para indicar éxito
    res.json({ message: 'Sesión cerrada' });
  }
};