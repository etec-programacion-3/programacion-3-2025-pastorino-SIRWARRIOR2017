import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Paper
} from '@mui/material';
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const adminSections = [
    {
      title: 'Gestión de Productos',
      description: 'Administrar productos, stock y precios',
      icon: <Package size={48} />,
      path: '/admin/products',
      color: '#1976d2'
    },
    {
      title: 'Gestión de Órdenes',
      description: 'Ver y administrar órdenes de compra',
      icon: <ShoppingCart size={48} />,
      path: '/admin/orders',
      color: '#388e3c'
    },
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar usuarios del sistema',
      icon: <Users size={48} />,
      path: '/admin/users',
      color: '#7b1fa2'
    },
    {
      title: 'Reportes',
      description: 'Ver estadísticas y reportes',
      icon: <BarChart3 size={48} />,
      path: '/admin/reports',
      color: '#c62828'
    },
    {
      title: 'Configuración',
      description: 'Configuración del sistema',
      icon: <Settings size={48} />,
      path: '/admin/settings',
      color: '#455a64'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Panel de Administración
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bienvenido al panel de control. Selecciona una sección para comenzar.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {adminSections.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.path}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea
                onClick={() => navigate(section.path)}
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 2,
                      color: section.color
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    component="div"
                    align="center"
                    gutterBottom
                  >
                    {section.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    {section.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;
