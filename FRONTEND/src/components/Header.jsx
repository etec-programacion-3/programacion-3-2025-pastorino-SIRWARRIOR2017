import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Container,
  Avatar,
  Divider,
  ListItemIcon
} from '@mui/material';
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  Shield
} from 'lucide-react';
import CartContext from '../contexts/CartContext';
import AuthContext from '../contexts/AuthContext';

const Header = () => {
  const { getTotalItems } = useContext(CartContext);
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/');
  };

  const handleNavigate = (path) => {
    handleClose();
    navigate(path);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar
      position="sticky"
      elevation={scrolled ? 4 : 0}
      sx={{
        background: scrolled
          ? 'rgba(255, 255, 255, 0.95)'
          : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease-in-out',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 } }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 },
              mr: { md: 6 },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: scrolled
                  ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                  : 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.2rem',
                color: scrolled ? 'white' : 'white',
                transition: 'all 0.3s ease',
              }}
            >
              PC
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '1.4rem',
                color: scrolled ? 'primary.main' : 'white',
                letterSpacing: '-0.02em',
                transition: 'color 0.3s ease',
              }}
            >
              PC Store
            </Typography>
          </Box>

          {/* Navigation */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              flexGrow: 1,
            }}
          >
            <Button
              component={Link}
              to="/"
              sx={{
                color: scrolled ? 'text.primary' : 'white',
                fontWeight: 600,
                px: 2,
                '&:hover': {
                  backgroundColor: scrolled ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Inicio
            </Button>
            <Button
              component={Link}
              to="/products"
              sx={{
                color: scrolled ? 'text.primary' : 'white',
                fontWeight: 600,
                px: 2,
                '&:hover': {
                  backgroundColor: scrolled ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Productos
            </Button>
            <Button
              component={Link}
              to="/technical-service"
              sx={{
                color: scrolled ? 'text.primary' : 'white',
                fontWeight: 600,
                px: 2,
                '&:hover': {
                  backgroundColor: scrolled ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Servicios
            </Button>
          </Box>

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Cart */}
            <IconButton
              component={Link}
              to="/cart"
              sx={{
                color: scrolled ? 'primary.main' : 'white',
                '&:hover': {
                  backgroundColor: scrolled ? 'rgba(37, 99, 235, 0.08)' : 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <Badge badgeContent={getTotalItems()} color="error">
                <ShoppingCart size={22} />
              </Badge>
            </IconButton>

            {/* User Menu */}
            {isAuthenticated ? (
              <>
                <IconButton
                  onClick={handleMenu}
                  sx={{
                    ml: 1,
                    p: 0.5,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: scrolled ? 'primary.main' : 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      border: scrolled ? 'none' : '2px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    {getInitials(user?.name)}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {user?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => handleNavigate('/profile')}>
                    <ListItemIcon>
                      <User size={18} />
                    </ListItemIcon>
                    Mi Perfil
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/orders')}>
                    <ListItemIcon>
                      <Package size={18} />
                    </ListItemIcon>
                    Mis Órdenes
                  </MenuItem>
                  {user?.role === 'admin' && (
                    <>
                      <Divider />
                      <MenuItem onClick={() => handleNavigate('/admin')}>
                        <ListItemIcon>
                          <Shield size={18} />
                        </ListItemIcon>
                        Panel Admin
                      </MenuItem>
                    </>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                      <LogOut size={18} color="#ef4444" />
                    </ListItemIcon>
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/register"
                  sx={{
                    borderColor: scrolled ? 'primary.main' : 'white',
                    borderWidth: 2,
                    color: scrolled ? 'primary.main' : 'white',
                    fontWeight: 600,
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: scrolled ? 'primary.dark' : 'white',
                      backgroundColor: scrolled ? 'rgba(37, 99, 235, 0.08)' : 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Registrarse
                </Button>
                <Button
                  variant="contained"
                  component={Link}
                  to="/login"
                  sx={{
                    bgcolor: scrolled ? 'primary.main' : 'white',
                    color: scrolled ? 'white' : 'primary.main',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: scrolled ? 'primary.dark' : 'rgba(255,255,255,0.9)',
                    },
                  }}
                >
                  Ingresar
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
