import { useState, useContext } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Divider,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, User, Lock, CheckCircle } from 'lucide-react';
import AuthContext from '../contexts/AuthContext';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853"/>
    <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
  </svg>
);

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return 'El formato del email no es válido';
    }

    return null;
  };

  // Validar contraseña (mejorada con requisitos de seguridad)
  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula';
    }
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula';
    }
    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    return null;
  };

  // Manejar cambios en los campos
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [field]: value });

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  // Validar formulario completo
  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    // Validar contraseña
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar la contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      // Redirigir al inicio después del registro exitoso
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    }
  };

  const handleGoogleSignUp = () => {
    // Redirigir al backend para iniciar el flujo de OAuth
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/google`;
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <User size={32} color="white" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Crear Cuenta
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Únete a PC Store y comienza a comprar
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}


        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2.5 }}>
          {/* Nombre */}
          <TextField
            label="Nombre completo"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <User size={20} />
                </InputAdornment>
              ),
            }}
          />

          {/* Email */}
          <TextField
            label="Correo electrónico"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={20} />
                </InputAdornment>
              ),
            }}
          />

          {/* Contraseña */}
          <TextField
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange('password')}
            error={!!errors.password}
            helperText={errors.password || 'Mínimo 6 caracteres'}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={20} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Confirmar Contraseña */}
          <TextField
            label="Confirmar contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CheckCircle size={20} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: 700,
              fontSize: '1rem',
              mt: 2,
            }}
          >
            Crear Cuenta
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            O continuar con
          </Typography>
        </Divider>

        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={handleGoogleSignUp}
          startIcon={<GoogleIcon />}
          sx={{
            py: 1.5,
            fontWeight: 600,
            fontSize: '1rem',
            borderColor: 'divider',
            color: 'text.primary',
            '&:hover': {
              borderColor: 'divider',
              backgroundColor: 'action.hover',
            },
          }}
        >
          Registrarse con Google
        </Button>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            ¿Ya tienes una cuenta?{' '}
            <MuiLink
              component={Link}
              to="/login"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Inicia sesión aquí
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
