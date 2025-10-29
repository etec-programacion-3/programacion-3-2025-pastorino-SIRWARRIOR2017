import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { Box, CircularProgress } from '@mui/material';
import Header from './Header';
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
    <>
      <Header />
      <PageContainer>
        <Outlet />
      </PageContainer>
    </>
  );
};

export default Layout;