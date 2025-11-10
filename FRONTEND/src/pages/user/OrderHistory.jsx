import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Button
} from '@mui/material';
import { ChevronDown, ChevronUp, Package, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import * as api from '../../services/api';

const statusColors = {
  pending: 'warning',
  paid: 'info',
  shipped: 'success',
  cancelled: 'error'
};

const statusLabels = {
  pending: 'Pendiente',
  paid: 'Pagado',
  shipped: 'Enviado',
  cancelled: 'Cancelado'
};

const OrderCard = ({ order }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Orden #{order.orderNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(order.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </Box>
          <Chip
            label={statusLabels[order.status]}
            color={statusColors[order.status]}
            size="medium"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea' }}>
              ${parseFloat(order.total).toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Productos
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {order.OrderItems?.length || 0}
            </Typography>
          </Grid>
        </Grid>

        {order.address && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Dirección de envío
            </Typography>
            <Typography variant="body2">{order.address}</Typography>
          </Box>
        )}

        <Button
          fullWidth
          variant="outlined"
          onClick={() => setOpen(!open)}
          endIcon={open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        >
          {open ? 'Ocultar Detalles' : 'Ver Detalles'}
        </Button>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Productos de la Orden
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="center">Cantidad</TableCell>
                    <TableCell align="right">Precio Unit.</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.OrderItems?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Box
                            component="img"
                            src={
                              item.Product?.images?.[0]
                                ? `http://localhost:3000${item.Product.images[0]}`
                                : 'https://via.placeholder.com/40?text=Sin+Imagen'
                            }
                            alt={item.Product?.name}
                            sx={{
                              width: 40,
                              height: 40,
                              objectFit: 'cover',
                              borderRadius: 1,
                            }}
                          />
                          <Typography variant="body2">
                            {item.Product?.name || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">
                        ${parseFloat(item.price || item.unitPrice).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        ${(item.quantity * parseFloat(item.price || item.unitPrice)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar tus órdenes');
      console.error(err);
      toast.error('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Cargando tus órdenes...</Alert>
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
          📦 Mis Órdenes
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Package size={64} style={{ color: '#ccc', marginBottom: 20 }} />
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            No tienes órdenes aún
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Cuando realices una compra, tus órdenes aparecerán aquí
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{ backgroundColor: '#667eea' }}
          >
            Explorar Productos
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Tienes {orders.length} {orders.length === 1 ? 'orden' : 'órdenes'}
          </Typography>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </>
      )}
    </Container>
  );
};

export default MyOrders;
