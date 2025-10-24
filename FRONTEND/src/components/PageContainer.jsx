import { Container, Box } from '@mui/material';

const PageContainer = ({ children }) => {
  return (
    <Box sx={{ 
      pt: '64px', // Espacio para el AppBar fijo
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
};

export default PageContainer;