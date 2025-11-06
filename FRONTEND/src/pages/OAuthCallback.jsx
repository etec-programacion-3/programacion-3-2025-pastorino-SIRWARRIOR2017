import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import AuthContext from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        const error = searchParams.get('error');

        if (error) {
          toast.error('Error al autenticar con Google');
          navigate('/login');
          return;
        }

        if (!token || !userParam) {
          toast.error('Datos de autenticación incompletos');
          navigate('/login');
          return;
        }

        // Decodificar usuario
        const user = JSON.parse(decodeURIComponent(userParam));

        // Guardar en el contexto de autenticación
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Actualizar el contexto
        await login({ skipApi: true, user, token });

        toast.success(`Bienvenido ${user.name}!`);
        navigate('/');
      } catch (error) {
        console.error('Error processing OAuth callback:', error);
        toast.error('Error al procesar la autenticación');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        gap: 2
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        Autenticando con Google...
      </Typography>
    </Box>
  );
};

export default OAuthCallback;
