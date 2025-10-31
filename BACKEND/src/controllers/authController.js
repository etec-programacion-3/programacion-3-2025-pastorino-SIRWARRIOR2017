const jwt = require('jsonwebtoken');
const { User } = require('../models');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Crear usuario (los usuarios ahora se marcan como verificados por defecto)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      isVerified: true
    });

    // Generar token JWT
    let token = null;
    try {
      if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not configured');
      token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    } catch (jwtErr) {
      console.error('JWT generation failed for new user:', jwtErr.message);
    }

    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    if (token) {
      return res.status(201).json({ user: publicUser, token });
    }

    return res.status(201).json({ user: publicUser, warning: 'Token not generated' });
  } catch (err) {
    console.error('Registration error:', err);
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

    // Verificar si el usuario está bloqueado
    if (user.isBlocked) {
      console.log('User is blocked');
      return res.status(403).json({
        error: 'Account blocked',
        message: 'Tu cuenta ha sido bloqueada. Contacta al administrador.',
        reason: user.blockedReason
      });
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

// Google OAuth callback handler
const googleCallback = async (req, res) => {
  try {
    // El usuario ya fue autenticado por Passport
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture
    };

    // Redirigir al frontend con el token y usuario
    const userData = encodeURIComponent(JSON.stringify(publicUser));
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${userData}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};

module.exports = { register, login, googleCallback };