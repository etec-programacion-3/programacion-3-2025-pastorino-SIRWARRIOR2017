import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Actualizar el estado para que el siguiente render muestre la UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes enviar el error a un servicio de logging
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Aquí podrías enviar el error a un servicio como Sentry
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            
            <Typography variant="h4" gutterBottom>
              ¡Ups! Algo salió mal
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              Lo sentimos, ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
            </Typography>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={this.handleReload}
              >
                Recargar Página
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary"
                onClick={this.handleGoHome}
              >
                Ir al Inicio
              </Button>
            </Box>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ mt: 4, textAlign: 'left' }}>
                <Typography variant="h6" color="error" gutterBottom>
                  Detalles del Error (solo en desarrollo):
                </Typography>
                <Paper 
                  sx={{ 
                    p: 2, 
                    bgcolor: '#f5f5f5', 
                    maxHeight: 300, 
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}
                >
                  <Typography variant="body2" color="error">
                    {this.state.error.toString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
                    {this.state.errorInfo.componentStack}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
