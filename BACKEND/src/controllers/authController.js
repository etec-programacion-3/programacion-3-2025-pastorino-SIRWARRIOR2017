const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

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
      if (!process.env.JWT_SECRET) {
        logger.error('JWT_SECRET not configured - cannot generate token');
        throw new Error('JWT_SECRET not configured');
      }
      token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );
    } catch (jwtErr) {
      logger.error('JWT generation failed for new user:', jwtErr.message);
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
    logger.error('Registration error:', err);
    const message = process.env.NODE_ENV === 'production'
      ? 'Registration failed'
      : err.message;
    return res.status(500).json({ error: 'Registration failed', details: message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logger.debug('Login attempt with missing credentials');
      return res.status(400).json({ error: 'email and password required' });
    }

    logger.debug(`Login attempt for email: ${email}`);
    const user = await User.findOne({ where: { email } });

    if (!user) {
      logger.debug(`Login failed: User not found for email ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verificar si el usuario está bloqueado
    if (user.isBlocked) {
      logger.warn(`Login attempt for blocked user: ${email}`);
      return res.status(403).json({
        error: 'Account blocked',
        message: 'Tu cuenta ha sido bloqueada. Contacta al administrador.',
        reason: user.blockedReason
      });
    }

    try {
      const valid = await user.validatePassword(password);

      if (!valid) {
        logger.debug(`Login failed: Invalid password for email ${email}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (validationError) {
      logger.error('Password validation error:', validationError);
      throw validationError;
    }

    // Validar que JWT_SECRET esté configurado
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET not configured - cannot generate token');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    logger.info(`User logged in successfully: ${email}`);
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
    logger.error('Login error:', err);
    const message = process.env.NODE_ENV === 'production'
      ? 'Login failed'
      : err.message;
    return res.status(500).json({ error: 'Login failed', details: message });
  }
};

// Google OAuth callback handler
const googleCallback = async (req, res) => {
  try {
    // El usuario ya fue autenticado por Passport
    const user = req.user;

    if (!user) {
      logger.warn('Google OAuth callback without user');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
    }

    // Validar que JWT_SECRET esté configurado
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET not configured - cannot generate token');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture
    };

    logger.info(`User logged in via Google OAuth: ${user.email}`);

    // Redirigir al frontend con el token y usuario
    const userData = encodeURIComponent(JSON.stringify(publicUser));
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${userData}`);
  } catch (error) {
    logger.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};

module.exports = { register, login, googleCallback };