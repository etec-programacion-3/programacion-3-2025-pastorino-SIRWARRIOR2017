import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Chip,
  Stack,
  alpha,
} from '@mui/material';
import { ArrowRight, Zap, Shield, Truck, Award, Sparkles, TrendingUp } from 'lucide-react';
import * as api from '../services/api';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cats = await api.getCategories?.() || [];
        setCategories(cats.slice(0, 6));

        const prods = await api.getProducts?.() || { products: [] };
        setFeaturedProducts(prods.products?.slice(0, 8) || []);
      } catch (err) {
        console.error('Error loading home data:', err);
      }
    };
    loadData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          color: 'white',
          py: { xs: 10, md: 16 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Chip
            icon={<Sparkles size={16} />}
            label="Tu tienda de tecnología de confianza"
            sx={{
              mb: 3,
              backgroundColor: alpha('#ffffff', 0.2),
              color: 'white',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              fontWeight: 600,
            }}
          />

          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '4.5rem' },
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Potencia tu Setup
            <br />
            con los Mejores Componentes
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 5,
              opacity: 0.95,
              maxWidth: 700,
              mx: 'auto',
              fontWeight: 400,
              fontSize: { xs: '1.1rem', md: '1.4rem' },
            }}
          >
            Descubre componentes de alta calidad, precios competitivos y servicio técnico especializado
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/products"
              endIcon={<ArrowRight size={20} />}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.9),
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Ver Catálogo
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/technical-service"
              sx={{
                borderColor: 'white',
                borderWidth: 2,
                color: 'white',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.15),
                  borderColor: 'white',
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Servicio Técnico
            </Button>
          </Stack>
        </Container>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            background: 'linear-gradient(to top, rgba(248,250,252,1) 0%, transparent 100%)',
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {/* Características */}
        <Grid container spacing={3} sx={{ mb: { xs: 8, md: 12 } }}>
          {[
            {
              icon: Zap,
              title: 'Productos Premium',
              description: 'Componentes de las mejores marcas del mercado',
              color: '#f59e0b',
            },
            {
              icon: Shield,
              title: 'Garantía Total',
              description: 'Respaldo completo en todos nuestros productos',
              color: '#10b981',
            },
            {
              icon: Truck,
              title: 'Envío Rápido',
              description: 'Entrega en 2-3 días hábiles a todo el país',
              color: '#2563eb',
            },
            {
              icon: Award,
              title: 'Soporte Experto',
              description: 'Servicio técnico profesional certificado',
              color: '#7c3aed',
            },
          ].map((feature, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: 'white',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    borderColor: feature.color,
                    '& .feature-icon': {
                      transform: 'scale(1.1)',
                      color: feature.color,
                    },
                  },
                }}
              >
                <Box
                  className="feature-icon"
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(feature.color, 0.1),
                    margin: '0 auto 20px',
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <feature.icon size={32} style={{ color: feature.color }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Categorías */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                letterSpacing: 2,
                fontSize: '0.875rem',
              }}
            >
              EXPLORA NUESTRO CATÁLOGO
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.75rem' },
              }}
            >
              Categorías de Productos
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Todo lo que necesitas para armar o actualizar tu PC
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {categories.map((cat) => (
              <Grid item xs={12} sm={6} md={4} key={cat.id}>
                <Card
                  component={RouterLink}
                  to={`/products?category=${cat.id}`}
                  sx={{
                    textDecoration: 'none',
                    cursor: 'pointer',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                      '& .category-overlay': {
                        backgroundColor: alpha('#2563eb', 0.1),
                      },
                      '& .category-name': {
                        color: 'primary.main',
                      },
                    },
                  }}
                >
                  {cat.image && (
                    <CardMedia
                      component="img"
                      height="220"
                      image={cat.image}
                      alt={cat.name}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <Box
                    className="category-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: alpha('#000000', 0.02),
                      transition: 'all 0.3s ease-in-out',
                    }}
                  />
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                      className="category-name"
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 0.5,
                        transition: 'color 0.3s ease-in-out',
                      }}
                    >
                      {cat.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {cat.productCount || 0} productos disponibles
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Productos Destacados */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 6,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  letterSpacing: 2,
                  fontSize: '0.875rem',
                }}
              >
                LO MÁS POPULAR
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '2.75rem' },
                }}
              >
                Productos Destacados
              </Typography>
            </Box>
            <Button
              variant="outlined"
              component={RouterLink}
              to="/products"
              endIcon={<ArrowRight size={20} />}
              sx={{
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              }}
            >
              Ver todo el catálogo
            </Button>
          </Box>

          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  component={RouterLink}
                  to={`/products/${product.id}`}
                  sx={{
                    textDecoration: 'none',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                      '& .product-image': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                >
                  {product.stock > 0 && product.stock < 10 && (
                    <Chip
                      icon={<TrendingUp size={14} />}
                      label="Últimas unidades"
                      size="small"
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 1,
                        fontWeight: 600,
                      }}
                    />
                  )}

                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: 240,
                      overflow: 'hidden',
                      backgroundColor: '#f8fafc',
                    }}
                  >
                    <CardMedia
                      className="product-image"
                      component="img"
                      image={
                        product.images?.[0]
                          ? `http://localhost:3000${product.images[0]}`
                          : 'https://via.placeholder.com/300x240?text=PC+Component'
                      }
                      alt={product.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: 2,
                        transition: 'transform 0.3s ease-in-out',
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flex: 1, p: 2.5 }}>
                    {product.brand && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        {product.brand}
                      </Typography>
                    )}

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        fontSize: '1rem',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.6em',
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'baseline', mb: 2 }}>
                      <Typography
                        variant="h5"
                        sx={{ color: 'primary.main', fontWeight: 800 }}
                      >
                        ${parseFloat(product.price || 0).toFixed(2)}
                      </Typography>
                      {product.originalPrice && (
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: 'line-through',
                            color: 'text.secondary',
                          }}
                        >
                          ${parseFloat(product.originalPrice).toFixed(2)}
                        </Typography>
                      )}
                    </Box>

                    {product.stock > 0 ? (
                      <Chip
                        label={`${product.stock} en stock`}
                        size="small"
                        sx={{
                          backgroundColor: alpha('#10b981', 0.1),
                          color: '#10b981',
                          fontWeight: 600,
                        }}
                      />
                    ) : (
                      <Chip
                        label="Sin stock"
                        size="small"
                        color="error"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            color: 'white',
            p: { xs: 6, md: 8 },
            textAlign: 'center',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              pointerEvents: 'none',
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 700, mx: 'auto' }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                backgroundColor: alpha('#ffffff', 0.2),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <Award size={32} />
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.75rem' },
              }}
            >
              ¿Necesitas Servicio Técnico?
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.95,
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Nuestro equipo de técnicos certificados está listo para ayudarte con
              mantenimiento, reparaciones y actualizaciones de tu equipo
            </Typography>

            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/technical-service"
              endIcon={<ArrowRight size={20} />}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.9),
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Contactar Servicio Técnico
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Home;