import { AppBar, Toolbar, Typography, Button, Badge } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import CartContext from '../contexts/CartContext';
import AuthContext from '../contexts/AuthContext';

const Header = () => {
  const { getTotalItems } = useContext(CartContext);
  const { state: authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
          PC Store
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/products">
          Productos
        </Button>

        <Button color="inherit" component={Link} to="/cart">
          <Badge badgeContent={getTotalItems()} color="secondary">
            <span style={{ color: 'white' }}>Carrito</span>
          </Badge>
        </Button>

        {authState.isAuthenticated ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;