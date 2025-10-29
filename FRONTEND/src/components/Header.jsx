import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Badge,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Box
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import {
  AccountCircle,
  Settings,
  ShoppingBag,
  Logout,
  Person,
  History,
  Support,
  Favorite,
  Business
} from '@mui/icons-material';
import CartContext from '../contexts/CartContext';
import AuthContext from '../contexts/AuthContext';

const Header = () => {
  const { getTotalItems } = useContext(CartContext);
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

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
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        {/* Logo y nombre */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Business sx={{ fontSize: 28 }} />
          PC Store
        </Typography>

        {/* Botones de navegación */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/products">
            Productos
          </Button>
          <Button color="inherit" component={Link} to="/technical-service">
            Servicios
          </Button>

          {/* Carrito */}
          <Button color="inherit" component={Link} to="/cart">
            <Badge badgeContent={getTotalItems()} color="error">
              <ShoppingBag />
            </Badge>
          </Button>

          {/* Menú de usuario */}
          {isAuthenticated ? (
            <>
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
                aria-label="menu de usuario"
                aria-controls="menu-appbar"
                aria-haspopup="true"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {getInitials(user?.name)}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1,
                      borderRadius: 0.5,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle1" noWrap>
                    {user?.name || 'Usuario'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {user?.email || 'email@example.com'}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => handleNavigate('/profile')}>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  Mi Perfil
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/orders')}>
                  <ListItemIcon>
                    <ShoppingBag fontSize="small" />
                  </ListItemIcon>
                  Mis Pedidos
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/favorites')}>
                  <ListItemIcon>
                    <Favorite fontSize="small" />
                  </ListItemIcon>
                  Favoritos
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/service-history')}>
                  <ListItemIcon>
                    <History fontSize="small" />
                  </ListItemIcon>
                  Historial de Servicios
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/support')}>
                  <ListItemIcon>
                    <Support fontSize="small" />
                  </ListItemIcon>
                  Soporte Técnico
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/settings')}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Configuración
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <ListItemIcon>
                    <Logout fontSize="small" color="error" />
                  </ListItemIcon>
                  Cerrar Sesión
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                component={Link} 
                to="/register"
                sx={{ 
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;