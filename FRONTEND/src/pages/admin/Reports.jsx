import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Wrench
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="text.secondary" variant="body2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ color, fontWeight: 'bold' }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${color}15`,
            color: color
          }}
        >
          <Icon size={24} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    serviceRequests: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch órdenes
      const ordersRes = await axios.get(`${API_BASE_URL}/orders`, config);
      const orders = ordersRes.data || [];

      // Fetch productos
      const productsRes = await axios.get(`${API_BASE_URL}/products?limit=100`, config);
      const products = productsRes.data.products || [];

      // Fetch usuarios
      const usersRes = await axios.get(`${API_BASE_URL}/users`, config);
      const users = usersRes.data || [];

      // Fetch solicitudes de servicio
      const serviceReqRes = await axios.get(`${API_BASE_URL}/service-requests`, config);
      const serviceRequests = serviceReqRes.data || [];

      // Calcular estadísticas
      const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + parseFloat(order.total), 0);

      const pendingOrders = orders.filter(o => o.status === 'pending').length;

      setStats({
        totalRevenue: totalRevenue.toFixed(2),
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        pendingOrders: pendingOrders,
        serviceRequests: serviceRequests.filter(sr => sr.status === 'pending').length
      });

      // Órdenes recientes (últimas 5)
      setRecentOrders(orders.slice(0, 5));

      // Productos más vendidos
      const productSales = {};
      orders.forEach(order => {
        order.OrderItems?.forEach(item => {
          const productId = item.productId;
          if (!productSales[productId]) {
            productSales[productId] = {
              name: item.Product?.name || 'Producto',
              quantity: 0,
              revenue: 0
            };
          }
          productSales[productId].quantity += item.quantity;
          productSales[productId].revenue += item.quantity * parseFloat(item.price);
        });
      });

      const topProductsArray = Object.entries(productSales)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      setTopProducts(topProductsArray);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Cargando estadísticas...</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Reportes y Estadísticas
      </Typography>

      {/* Cards de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Ingresos Totales"
            value={`$${stats.totalRevenue}`}
            icon={DollarSign}
            color="#4caf50"
            subtitle="Todas las órdenes completadas"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Órdenes Totales"
            value={stats.totalOrders}
            icon={ShoppingCart}
            color="#2196f3"
            subtitle={`${stats.pendingOrders} pendientes`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Productos en Catálogo"
            value={stats.totalProducts}
            icon={Package}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Usuarios Registrados"
            value={stats.totalUsers}
            icon={Users}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Servicios Pendientes"
            value={stats.serviceRequests}
            icon={Wrench}
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Promedio por Orden"
            value={`$${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}`}
            icon={TrendingUp}
            color="#00bcd4"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Órdenes recientes */}
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Órdenes Recientes
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Número</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{order.User?.name || 'N/A'}</TableCell>
                      <TableCell>${parseFloat(order.total).toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={
                            order.status === 'paid' ? 'success' :
                            order.status === 'pending' ? 'warning' :
                            order.status === 'shipped' ? 'info' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString('es-ES')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Productos más vendidos */}
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Productos Más Vendidos
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Ingresos</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell align="right">{product.quantity}</TableCell>
                      <TableCell align="right">
                        ${product.revenue.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reports;
