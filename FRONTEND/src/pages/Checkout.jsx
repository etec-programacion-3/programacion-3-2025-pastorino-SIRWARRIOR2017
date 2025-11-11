import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress
} from '@mui/material';
import { CheckCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import CartContext from '../contexts/CartContext';
import AuthContext from '../contexts/AuthContext';
import { validateCardNumber, validateExpiryDate, validateCVV, detectCardType, formatCardNumber } from '../utils/cardValidation';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const steps = ['Revisar Orden', 'Información de Envío', 'Método de Pago', 'Confirmar'];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useContext(CartContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [formData, setFormData] = useState({
    address: user?.address || '',
    phone: user?.phone || '',
    notes: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para realizar una compra');
      navigate('/login');
      return;
    }

    if (items.length === 0 && !orderComplete) {
      toast.error('Tu carrito está vacío');
      navigate('/cart');
    }
  }, [isAuthenticated, items, navigate, orderComplete]);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.16;
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + tax + shipping;

  const validateStep = () => {
    const newErrors = {};

    if (activeStep === 1) {
      if (!formData.address.trim()) {
        newErrors.address = 'La dirección es requerida';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'El teléfono es requerido';
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Teléfono inválido (10 dígitos)';
      }
    }

    if (activeStep === 2) {
      // Validar número de tarjeta con algoritmo de Luhn
      const cardNumberClean = formData.cardNumber.replace(/\s/g, '');
      if (!cardNumberClean) {
        newErrors.cardNumber = 'El número de tarjeta es requerido';
      } else if (!/^\d{13,19}$/.test(cardNumberClean)) {
        newErrors.cardNumber = 'El número de tarjeta debe tener entre 13 y 19 dígitos';
      } else if (!validateCardNumber(cardNumberClean)) {
        newErrors.cardNumber = 'El número de tarjeta no es válido';
      }

      // Validar nombre en la tarjeta
      if (!formData.cardName.trim()) {
        newErrors.cardName = 'El nombre en la tarjeta es requerido';
      } else if (formData.cardName.trim().length < 3) {
        newErrors.cardName = 'El nombre debe tener al menos 3 caracteres';
      }

      // Validar fecha de vencimiento (MM/YY)
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'La fecha de vencimiento es requerida';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Formato inválido (MM/AA)';
      } else {
        const [month, year] = formData.expiryDate.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        if (parseInt(month) < 1 || parseInt(month) > 12) {
          newErrors.expiryDate = 'Mes inválido';
        } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
          newErrors.expiryDate = 'Tarjeta vencida';
        }
      }

      // Validar CVV con detección de tipo de tarjeta
      const cardType = detectCardType(cardNumberClean);
      if (!formData.cvv) {
        newErrors.cvv = 'El CVV es requerido';
      } else if (!validateCVV(formData.cvv, cardType)) {
        const expectedLength = cardType === 'amex' ? 4 : 3;
        newErrors.cvv = `CVV inválido (debe tener ${expectedLength} dígitos)`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Formatear número de tarjeta (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Formatear fecha de vencimiento (MM/YY)
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  // Manejar cambio en número de tarjeta
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setFormData({ ...formData, cardNumber: formatted });
    }
  };

  // Manejar cambio en fecha de vencimiento
  const handleExpiryDateChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace(/\//g, '').length <= 4) {
      setFormData({ ...formData, expiryDate: formatted });
    }
  };

  // Manejar cambio en CVV
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 4) {
      setFormData({ ...formData, cvv: value });
    }
  };

  const handleSubmitOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Crear la orden desde el carrito del backend (ya sincronizado)
      const response = await axios.post(
        `${API_BASE_URL}/orders`,
        { address: formData.address },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrderNumber(response.data.orderNumber);
      setOrderComplete(true);
      clearCart();
      toast.success('¡Orden creada exitosamente!');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.error || 'Error al crear la orden');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CheckCircle size={80} color="#4caf50" />
          </Box>
          <Typography variant="h4" gutterBottom>
            ¡Orden Completada!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Tu orden ha sido creada exitosamente.
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            Número de Orden: {orderNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Recibirás un correo electrónico con los detalles de tu orden.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/orders')}
            >
              Ver Mis Órdenes
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/products')}
            >
              Seguir Comprando
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Productos en tu orden
            </Typography>
            <List>
              {items.map((item) => (
                <ListItem key={item.id}>
                  <ListItemAvatar>
                    <Avatar
                      src={
                        item.images?.[0]
                          ? `http://localhost:3000${item.images[0]}`
                          : 'https://via.placeholder.com/60?text=Sin+Imagen'
                      }
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`Cantidad: ${item.quantity}`}
                    sx={{ ml: 2 }}
                  />
                  <Typography variant="body1" fontWeight="bold">
                    ${(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Información de Envío
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre Completo"
                  value={user?.name || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={user?.email || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección de Envío"
                  multiline
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  error={!!errors.address}
                  helperText={errors.address}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notas Adicionales (Opcional)"
                  multiline
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Método de Pago
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Ingresa los datos de tu tarjeta de crédito o débito de forma segura.
            </Alert>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Número de Tarjeta"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                  required
                  inputProps={{ maxLength: 19 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre en la Tarjeta"
                  placeholder="JUAN PEREZ"
                  value={formData.cardName}
                  onChange={(e) => setFormData({ ...formData, cardName: e.target.value.toUpperCase() })}
                  error={!!errors.cardName}
                  helperText={errors.cardName}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Fecha de Vencimiento"
                  placeholder="MM/AA"
                  value={formData.expiryDate}
                  onChange={handleExpiryDateChange}
                  error={!!errors.expiryDate}
                  helperText={errors.expiryDate}
                  required
                  inputProps={{ maxLength: 5 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleCvvChange}
                  error={!!errors.cvv}
                  helperText={errors.cvv}
                  required
                  type="password"
                  inputProps={{ maxLength: 4 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Alert severity="success" icon={false}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    🔒 Tu información está protegida con encriptación SSL
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirmar Orden
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Por favor, revisa toda la información antes de confirmar tu orden.
            </Alert>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Enviando a:
              </Typography>
              <Typography variant="body1">{user?.name}</Typography>
              <Typography variant="body2">{formData.address}</Typography>
              <Typography variant="body2">{formData.phone}</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Método de Pago:
              </Typography>
              <Typography variant="body1">
                **** **** **** {formData.cardNumber.slice(-4)}
              </Typography>
              <Typography variant="body2">{formData.cardName}</Typography>
            </Paper>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {items.length} producto(s) en esta orden
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowLeft />}
        onClick={() => navigate('/cart')}
        sx={{ mb: 2 }}
      >
        Volver al Carrito
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Finalizar Compra
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {renderStepContent()}
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Resumen
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>IVA (16%):</Typography>
                <Typography>${tax.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Envío:</Typography>
                <Typography>
                  {shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${total.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {activeStep < steps.length - 1 ? (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      fullWidth
                    >
                      Continuar
                    </Button>
                    {activeStep > 0 && (
                      <Button
                        variant="outlined"
                        onClick={handleBack}
                        fullWidth
                      >
                        Atrás
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleSubmitOrder}
                      disabled={loading}
                      fullWidth
                      startIcon={loading ? <CircularProgress size={20} /> : <ShoppingBag size={20} />}
                    >
                      {loading ? 'Procesando...' : 'Confirmar Orden'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      disabled={loading}
                      fullWidth
                    >
                      Atrás
                    </Button>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Checkout;
