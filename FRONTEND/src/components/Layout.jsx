import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';
import PageContainer from './PageContainer';
import AuthContext from '../contexts/AuthContext';

const Layout = () => {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
      <Header />
      <Box sx={{ flex: 1 }}>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;