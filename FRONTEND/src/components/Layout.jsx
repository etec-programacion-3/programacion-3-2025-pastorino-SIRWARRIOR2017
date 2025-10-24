import { Outlet } from 'react-router-dom';
import Header from './Header';
import PageContainer from './PageContainer';

const Layout = () => {
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