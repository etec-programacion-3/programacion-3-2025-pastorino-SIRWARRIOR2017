import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import { Alert, Container, Box } from '@mui/material';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Alert severity="info">Cargando...</Alert>
        </Box>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            No tienes permisos para acceder a esta página. Se requieren privilegios de administrador.
          </Alert>
        </Box>
      </Container>
    );
  }

  return children;
};

export default ProtectedRoute;
