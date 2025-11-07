import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  TextField,
  IconButton,
  Alert,
  Divider,
  Grid,
  Chip,
  LinearProgress,
} from '@mui/material';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import CartContext from '../contexts/CartContext';
import AuthContext from '../contexts/AuthContext';
import { getResourceUrl } from '../config/api';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.16; // 16% IVA
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + tax + shipping;

  const handleQuantityChange = async (id, newQuantity, item) => {
    if (newQuantity < 1) {
      if (window.confirm(`¿Eliminar ${item.name} del carrito?`)) {
        removeItem(id);
        toast.success('Producto eliminado del carrito');
      }
      return;
    }

    // Validar que no exceda el stock
    if (newQuantity > item.stock) {
      toast.error(`Solo hay ${item.stock} unidades disponibles de ${item.name}`);
      return;
    }

    try {
      await updateQuantity(id, newQuantity);
      toast.success('Cantidad actualizada');
    } catch (err) {
      console.error('Error updating quantity:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Error al actualizar cantidad';
      toast.error(errorMsg);
    }
  };

  const handleRemoveItem = (id, name) => {
    removeItem(id);
    toast.success(`${name} eliminado del carrito`);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para continuar');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    if (items.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    // Validar stock antes de proceder
    const outOfStock = items.filter(item => item.quantity > item.stock);
    if (outOfStock.length > 0) {
      toast.error('Algunos productos exceden el stock disponible. Por favor ajusta las cantidades.');
      return;
    }

    setLoading(true);
    // Redirigir a la página de checkout
    navigate('/checkout');
  };

  const handleClearCart = () => {
    console.log('handleClearCart llamado');
    if (window.confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
      console.log('Usuario confirmó vaciar carrito');
      try {
        clearCart();
        toast.success('Carrito vaciado exitosamente');
      } catch (error) {
        console.error('Error al vaciar carrito:', error);
        toast.error('Error al vaciar el carrito');
      }
    } else {
      console.log('Usuario canceló vaciar carrito');
    }
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <ShoppingBag size={64} style={{ color: '#ccc', marginBottom: 20 }} />
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Tu carrito está vacío
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          ¿Qué esperas? ¡Ve a buscar los mejores componentes PC!
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/products')}
          sx={{ backgroundColor: '#667eea' }}
        >
          Continuar comprando
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Encabezado */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="text"
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
          🛒 Carrito de Compras
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Items del carrito */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ overflow: 'auto' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Precio
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Cantidad
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Subtotal
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Acción
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        '&:hover': { backgroundColor: '#f9f9f9' },
                        '&:last-child td': { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Box
                            component="img"
                            src={
                              item.images?.[0]
                                ? getResourceUrl(item.images[0])
                                : 'https://via.placeholder.com/60?text=Sin+Imagen'
                            }
                            alt={item.name}
                            sx={{
                              width: 60,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 1,
                            }}
                          />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {item.name}
                            </Typography>
                            {item.brand && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                {item.brand}
                              </Typography>
                            )}
                            {/* Indicador de stock */}
                            <Typography
                              variant="caption"
                              sx={{
                                color: item.stock < 5 ? 'error.main' : item.stock < 10 ? 'warning.main' : 'success.main',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                mt: 0.5
                              }}
                            >
                              {item.stock < 5 && <AlertTriangle size={12} />}
                              {item.stock === 0 ? 'Sin stock' : `${item.stock} disponibles`}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ color: '#667eea', fontWeight: 'bold' }}>
                          ${item.price?.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            justifyContent: 'center',
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1, item)
                            }
                            sx={{
                              bgcolor: 'grey.100',
                              '&:hover': { bgcolor: 'grey.200' }
                            }}
                          >
                            <Minus size={16} />
                          </IconButton>
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              handleQuantityChange(item.id, value, item);
                            }}
                            inputProps={{ min: 1, max: item.stock }}
                            sx={{
                              width: 70,
                              '& .MuiOutlinedInput-root': {
                                padding: 0,
                              },
                              '& input': {
                                textAlign: 'center',
                                fontWeight: 600,
                              },
                            }}
                            size="small"
                          />
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1, item)
                            }
                            disabled={item.quantity >= item.stock || item.stock === 0}
                            sx={{
                              bgcolor: item.quantity >= item.stock ? 'grey.100' : 'primary.main',
                              color: item.quantity >= item.stock ? 'grey.400' : 'white',
                              '&:hover': {
                                bgcolor: item.quantity >= item.stock ? 'grey.100' : 'primary.dark'
                              },
                              '&.Mui-disabled': {
                                bgcolor: 'grey.100',
                                color: 'grey.400'
                              }
                            }}
                          >
                            <Plus size={16} />
                          </IconButton>
                        </Box>
                        {/* Advertencia si excede el stock */}
                        {item.quantity > item.stock && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ display: 'block', mt: 0.5 }}
                          >
                            Excede el stock disponible
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontWeight: 'bold' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          color="error"
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {items.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {items.length} {items.length === 1 ? 'producto' : 'productos'} en el carrito
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearCart}
                startIcon={<Trash2 size={16} />}
              >
                Vaciar carrito
              </Button>
            </Box>
          )}
        </Grid>

        {/* Resumen de compra */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ backgroundColor: '#f9f9f9', position: 'sticky', top: 80 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                📋 Resumen de Compra
              </Typography>

              {/* Advertencia de stock */}
              {items.some(item => item.quantity > item.stock) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Algunos productos exceden el stock disponible. Ajusta las cantidades para continuar.
                </Alert>
              )}

              {/* Advertencia de stock bajo */}
              {items.some(item => item.stock < 5 && item.stock > 0) && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Algunos productos tienen stock limitado. ¡Completa tu compra pronto!
                </Alert>
              )}

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography>Subtotal:</Typography>
                  <Typography>${subtotal.toFixed(2)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography>IVA (16%):</Typography>
                  <Typography>${tax.toFixed(2)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography>Envío:</Typography>
                  {shipping === 0 ? (
                    <Chip label="Gratis" size="small" color="success" variant="outlined" />
                  ) : (
                    <Typography>${shipping.toFixed(2)}</Typography>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', color: '#667eea' }}
                >
                  ${total.toFixed(2)}
                </Typography>
              </Box>

              {!isAuthenticated && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Debes estar autenticado para proceder
                </Alert>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCheckout}
                disabled={
                  items.length === 0 ||
                  loading ||
                  items.some(item => item.quantity > item.stock) ||
                  items.some(item => item.stock === 0)
                }
                sx={{
                  backgroundColor: items.some(item => item.quantity > item.stock) ? 'grey.400' : '#667eea',
                  mb: 2,
                  '&:hover': {
                    backgroundColor: items.some(item => item.quantity > item.stock) ? 'grey.500' : '#5568d3',
                  }
                }}
              >
                {!isAuthenticated
                  ? 'Iniciar Sesión'
                  : items.some(item => item.quantity > item.stock)
                  ? 'Ajusta las cantidades'
                  : 'Proceder al Checkout'}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/products')}
              >
                Continuar comprando
              </Button>

              {/* Información de envío */}
              <Box sx={{ mt: 4, p: 2, backgroundColor: 'white', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  📦 Información de Envío
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Envío gratis para compras mayores a $1000
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary">
                  • Entrega en 2-3 días hábiles
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary">
                  • Rastreo en tiempo real
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;