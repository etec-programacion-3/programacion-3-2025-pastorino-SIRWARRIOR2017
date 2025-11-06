import React, { useState, useEffect } from 'react';
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
  TablePagination
} from '@mui/material';
import { ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar órdenes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Estado actualizado exitosamente');
      fetchOrders();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar estado');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <Container sx={{ mt: 4 }}><Alert severity="info">Cargando...</Alert></Container>;

  const paginatedOrders = orders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestión de Órdenes
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Número de Orden</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={orders.length}
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
