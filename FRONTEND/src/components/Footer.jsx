import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  Divider,
  IconButton,
  alpha,
} from '@mui/material';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight
} from 'lucide-react';
import SiteConfigContext from '../contexts/SiteConfigContext';

const Footer = () => {
  const { config } = useContext(SiteConfigContext);
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    productos: [
      { label: 'Catálogo Completo', path: '/products' },
      { label: 'Componentes', path: '/products?category=1' },
      { label: 'Periféricos', path: '/products?category=2' },
      { label: 'Ofertas', path: '/products' },
    ],
    servicios: [
      { label: 'Servicio Técnico', path: '/technical-service' },
      { label: 'Garantías', path: '/technical-service' },
      { label: 'Soporte', path: '/technical-service' },
      { label: 'Envíos', path: '/technical-service' },
    ],
    cuenta: [
      { label: 'Mi Perfil', path: '/profile' },
      { label: 'Mis Órdenes', path: '/orders' },
      { label: 'Carrito', path: '/cart' },
      { label: 'Iniciar Sesión', path: '/login' },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1e293b',
        color: 'white',
        pt: { xs: 6, md: 8 },
        pb: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                {config.logo ? (
                  <Box
                    component="img"
                    src={`http://localhost:3000${config.logo}`}
                    alt={config.siteName}
                    sx={{
                      height: 48,
                      maxWidth: 150,
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.5rem',
                      }}
                    >
                      {config.siteName?.substring(0, 2).toUpperCase() || 'PC'}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                      {config.siteName || 'PC Store'}
                    </Typography>
                  </>
                )}
              </Box>
              <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7), lineHeight: 1.7, mb: 3 }}>
                {config.siteSlogan || 'Tu tienda de confianza para componentes de PC de alta calidad. Construye el setup de tus sueños con los mejores precios y servicio técnico especializado.'}
              </Typography>

              {/* Social Icons */}
              <Stack direction="row" spacing={1}>
                {config.facebook && (
                  <IconButton
                    component="a"
                    href={config.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      color: 'white',
                      backgroundColor: alpha('#ffffff', 0.1),
                      '&:hover': {
                        backgroundColor: '#2563eb',
                      },
                    }}
                  >
                    <Facebook size={18} />
                  </IconButton>
                )}
                {config.twitter && (
                  <IconButton
                    component="a"
                    href={config.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      color: 'white',
                      backgroundColor: alpha('#ffffff', 0.1),
                      '&:hover': {
                        backgroundColor: '#2563eb',
                      },
                    }}
                  >
                    <Twitter size={18} />
                  </IconButton>
                )}
                {config.instagram && (
                  <IconButton
                    component="a"
                    href={config.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      color: 'white',
                      backgroundColor: alpha('#ffffff', 0.1),
                      '&:hover': {
                        backgroundColor: '#7c3aed',
                      },
                    }}
                  >
                    <Instagram size={18} />
                  </IconButton>
                )}
              </Stack>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '1rem' }}>
              Productos
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.productos.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: alpha('#ffffff', 0.7),
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: '#60a5fa',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ArrowRight size={14} />
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '1rem' }}>
              Servicios
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.servicios.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: alpha('#ffffff', 0.7),
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: '#60a5fa',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ArrowRight size={14} />
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '1rem' }}>
              Mi Cuenta
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.cuenta.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: alpha('#ffffff', 0.7),
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: '#60a5fa',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ArrowRight size={14} />
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '1rem' }}>
              Contacto
            </Typography>
            <Stack spacing={1.5}>
              {config.phone && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Phone size={16} style={{ marginTop: 2, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7), fontSize: '0.875rem' }}>
                    {config.phone}
                  </Typography>
                </Box>
              )}
              {config.email && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Mail size={16} style={{ marginTop: 2, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7), fontSize: '0.875rem' }}>
                    {config.email}
                  </Typography>
                </Box>
              )}
              {config.address && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <MapPin size={16} style={{ marginTop: 2, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7), fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {config.address}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: alpha('#ffffff', 0.1), mb: 3 }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6), fontSize: '0.875rem' }}>
            © {currentYear} {config.siteName || 'PC Store'}. Todos los derechos reservados.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link
              href="#"
              sx={{
                color: alpha('#ffffff', 0.6),
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: '#60a5fa',
                },
              }}
            >
              Términos y Condiciones
            </Link>
            <Link
              href="#"
              sx={{
                color: alpha('#ffffff', 0.6),
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: '#60a5fa',
                },
              }}
            >
              Privacidad
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
