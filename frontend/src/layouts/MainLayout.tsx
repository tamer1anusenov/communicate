import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const MainContent = styled(Box)(({ theme }) => ({
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f5f5f5',

}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(4, 0),
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '100%',
}));

const MainLayout: React.FC = () => {
  return (
    <MainContent>
      <CssBaseline />
      <Header />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
      <Footer />
    </MainContent>
  );
};

export default MainLayout; 