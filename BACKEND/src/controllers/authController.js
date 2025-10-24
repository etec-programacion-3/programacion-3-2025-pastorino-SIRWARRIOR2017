const jwt = require('jsonwebtoken');
const { User } = require('../models');

const register = async (req, res) => {
  try {
    // usar 'name' en lugar de 'username' para coincidir con el modelo User
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

  // Let the User model hook handle password hashing to avoid double-hashing
  const user = await User.create({ name, email, password, role: role || 'user' });

    let token = null;
    try {
      if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not configured');
      token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    } catch (jwtErr) {
      // No hacer que falle el registro si el token no puede generarse (por ejemplo .env faltante)
      console.error('JWT generation failed for new user:', jwtErr.message);
    }

    const publicUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    if (token) {
      return res.status(201).json({ user: publicUser, token });
    }
    // Token no disponible pero el usuario fue creado correctamente
    return res.status(201).json({ user: publicUser, warning: 'Token not generated' });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

const login = async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ error: 'email and password required' });
    }

    console.log('Finding user with email:', email);
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('User found, validating password');
    try {
      const valid = await user.validatePassword(password);
      console.log('Password validation result:', valid);
      
      if (!valid) {
        console.log('Invalid password');
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (validationError) {
      console.error('Password validation error:', validationError);
      throw validationError;
    }

    console.log('Generating token');
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    console.log('Login successful');
    return res.json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }, 
      token 
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

module.exports = { register, login };