import { Typography, Box, Paper, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ShoppingCart as ShoppingCartIcon, Build as BuildIcon } from '@mui/icons-material';

const Home = () => {
  return (
    <Box sx={{ pt: 4 }}>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3)',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.6)',
            borderRadius: 2
          }}
        />
        
        {/* Content */}
        <Box
          sx={{
            position: 'relative',
            p: { xs: 3, md: 6 },
            width: '100%',
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom
            sx={{
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,.5)',
              fontSize: { xs: '2.5rem', md: '3.75rem' }
            }}>
            Bienvenido a PC Store
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom paragraph
            sx={{
              textShadow: '1px 1px 2px rgba(0,0,0,.5)',
              maxWidth: '600px',
              mb: 4
            }}>
            Tu destino definitivo para componentes de PC de alta calidad. Construye tu próxima computadora con nosotros.
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                sx={{
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                Ver Productos
              </Button>
            </Grid>
            <Grid item>
              <Button
                component={Link}
                to="/technical-service"
                variant="outlined"
                size="large"
                startIcon={<BuildIcon />}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Servicio Técnico
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Features Section */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', backgroundColor: 'background.paper' }} elevation={2}>
            <Typography variant="h5" component="h3" gutterBottom color="primary" fontWeight="bold">
              Productos de Calidad
            </Typography>
            <Typography variant="body1">
              Ofrecemos los mejores componentes de las marcas más reconocidas del mercado.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', backgroundColor: 'background.paper' }} elevation={2}>
            <Typography variant="h5" component="h3" gutterBottom color="primary" fontWeight="bold">
              Asesoramiento Experto
            </Typography>
            <Typography variant="body1">
              Nuestro equipo te ayuda a elegir los componentes perfectos para tu necesidad.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', backgroundColor: 'background.paper' }} elevation={2}>
            <Typography variant="h5" component="h3" gutterBottom color="primary" fontWeight="bold">
              Soporte Técnico
            </Typography>
            <Typography variant="body1">
              Servicio post-venta y soporte técnico especializado para todos nuestros productos.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;