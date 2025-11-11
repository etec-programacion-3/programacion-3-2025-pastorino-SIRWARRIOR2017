import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Alert,
  IconButton,
  Collapse,
  TablePagination,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  InputLabel
} from '@mui/material';
import { ChevronDown, ChevronUp, Package, Clock, CheckCircle, XCircle, TruckIcon, Search, RefreshCw } from 'lucide-react';
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

const OrderRow = ({ order, onStatusChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </IconButton>
        </TableCell>
        <TableCell>{order.orderNumber}</TableCell>
        <TableCell>{order.User?.name || 'N/A'}</TableCell>
        <TableCell>{order.User?.email || 'N/A'}</TableCell>
        <TableCell>${parseFloat(order.total).toFixed(2)}</TableCell>
        <TableCell>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value)}
            >
              <MenuItem value="pending">Pendiente</MenuItem>
              <MenuItem value="paid">Pagado</MenuItem>
              <MenuItem value="shipped">Enviado</MenuItem>
              <MenuItem value="cancelled">Cancelado</MenuItem>
            </Select>
          </FormControl>
        </TableCell>
        <TableCell>
          {new Date(order.createdAt).toLocaleDateString('es-ES')}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom>
                Detalles de la Orden
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio Unitario</TableCell>
                    <TableCell>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.OrderItems?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.Product?.name || 'N/A'}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${parseFloat(item.price).toFixed(2)}</TableCell>
                      <TableCell>
                        ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {order.address && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">
                    <strong>Dirección de envío:</strong>
                  </Typography>
                  <Typography variant="body2">{order.address}</Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Pasar includeAll=true para obtener todas las órdenes (solo admin)
      const data = await api.getOrders({ includeAll: true });
      setOrders(data || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar órdenes');
      console.error(err);
      toast.error('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(term) ||
        order.User?.name.toLowerCase().includes(term) ||
        order.User?.email.toLowerCase().includes(term)
      );
    }

    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrder(orderId, { status: newStatus });
      toast.success('Estado actualizado exitosamente');
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Error al actualizar estado');
    }
  };

  const getStatusCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      paid: orders.filter(o => o.status === 'paid').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <Container sx={{ mt: 4 }}><Alert severity="info">Cargando...</Alert></Container>;

  const statusCounts = getStatusCounts();

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Gestión de Órdenes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Administra y da seguimiento a las órdenes de compra
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={2.4}>
          <Card sx={{ bgcolor: '#f5f5f5' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Package size={24} style={{ color: '#666' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                {statusCounts.all}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Órdenes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={2.4}>
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Clock size={24} style={{ color: '#f57c00' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                {statusCounts.pending}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pendientes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={2.4}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircle size={24} style={{ color: '#1976d2' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                {statusCounts.paid}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pagados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={2.4}>
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <TruckIcon size={24} style={{ color: '#388e3c' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                {statusCounts.shipped}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Enviados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={2.4}>
          <Card sx={{ bgcolor: '#ffebee' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <XCircle size={24} style={{ color: '#d32f2f' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                {statusCounts.cancelled}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cancelados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar por número de orden, cliente o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                )
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filtrar por Estado</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Filtrar por Estado"
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="pending">Pendientes</MenuItem>
                <MenuItem value="paid">Pagados</MenuItem>
                <MenuItem value="shipped">Enviados</MenuItem>
                <MenuItem value="cancelled">Cancelados</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RefreshCw size={18} />}
              onClick={fetchOrders}
            >
              Actualizar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell />
                <TableCell sx={{ fontWeight: 'bold' }}>Número de Orden</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    No se encontraron órdenes
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredOrders.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
        />
      </Paper>
    </Container>
  );
};

export default OrdersManagement;
