import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import whiteLogo from '../../assets/images/whitelogo.png';
import NotificationCenter from '../NotificationCenter/NotificationCenter';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#00A6B4',
  boxShadow: 'none',
  padding: '8px 0',
});

const LogoImage = styled('img')({
  height: '40px',
  marginRight: '20px',
});

const NavButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  textTransform: 'none',
  marginLeft: theme.spacing(2),
  padding: '6px 16px',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const AuthButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  borderColor: '#fff',
  '&:hover': {
    borderColor: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  padding: '6px 16px',
  fontSize: '0.9rem',
  textTransform: 'none',
  border: '1px solid #fff',
}));

const UserInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
  gap: '8px',
});

// Добавляем интерфейс для пунктов навигации
interface NavItem {
  label: string;
  path: string;
  state?: {
    tab?: number;
  };
}

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole') || '';

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    handleClose();
    navigate('/');
  };

  // Базовые пункты навигации для пациентов
  const patientNavItems: NavItem[] = [
    { label: 'Главная', path: '/' },
    { label: 'Врачи', path: '/doctors' },
    { label: 'Записаться на прием', path: '/appointment' },
    { label: 'Анализы', path: '/tests' },
    { label: 'О нас', path: '/about' },
    { label: 'Контакты', path: '/contacts' },
  ];

  // Пункты навигации для врачей
  const doctorNavItems: NavItem[] = [
    { label: 'Главная', path: '/doctor-dashboard' },
    { label: 'Приемы', path: '/doctor-dashboard', state: { tab: 0 } },
    { label: 'Мед. карты', path: '/doctor-dashboard/patient-selection' },
    { label: 'Анализы', path: '/doctor-dashboard/tests' },
  ];
  
  // Пункты навигации для администраторов
  const adminNavItems: NavItem[] = [
    { label: 'Главная', path: '/admin-dashboard' },
    { label: 'Врачи', path: '/admin-dashboard/doctors' },
    { label: 'Приемы', path: '/admin-dashboard/appointments' },
    { label: 'Управление анализами', path: '/admin-dashboard/tests' },
  ];

  // Выбор пунктов меню в зависимости от роли
  let navItems: NavItem[] = patientNavItems;
  
  if (userRole === 'doctor') {
    navItems = doctorNavItems;
  } else if (userRole === 'admin') {
    navItems = adminNavItems;
  }

  // Определяем куда редиректить по клику на логотип
  let logoPath = '/';
  if (userRole === 'doctor') {
    logoPath = '/doctor-dashboard';
  } else if (userRole === 'admin') {
    logoPath = '/admin-dashboard';
  }

  return (
    <StyledAppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: '64px' }}>
          <Link to={logoPath} style={{ display: 'flex', alignItems: 'center' }}>
            <LogoImage src={whiteLogo} alt="Керемет" />
          </Link>

          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
                sx={{ marginLeft: 'auto' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.path + (item.state ? JSON.stringify(item.state) : '')}
                    onClick={() => {
                      navigate(item.path, item.state ? { state: item.state } : undefined);
                      handleClose();
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
                {!isLoggedIn ? (
                  <>
                    <MenuItem onClick={() => {
                      navigate('/login');
                      handleClose();
                    }}>
                      Войти
                    </MenuItem>
                    <MenuItem onClick={() => {
                      navigate('/register');
                      handleClose();
                    }}>
                      Регистрация
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem>
                      <NotificationCenter />
                    </MenuItem>
                    {userRole !== 'admin' && (
                      <MenuItem onClick={() => {
                        navigate(userRole === 'doctor' ? '/doctor-dashboard' : '/profile');
                        handleClose();
                      }}>
                        Личный кабинет
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>
                      Выйти
                    </MenuItem>
                  </>
                )}
              </Menu>
            </>
          ) : (
            <>
              <Box sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                justifyContent: 'center',
                gap: '8px'
              }}>
                {navItems.map((item) => (
                  <NavButton
                    key={item.path + (item.state ? JSON.stringify(item.state) : '')}
                    onClick={() => navigate(item.path, item.state ? { state: item.state } : undefined)}
                  >
                    {item.label}
                  </NavButton>
                ))}
              </Box>

              {!isLoggedIn ? (
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <AuthButton onClick={() => navigate('/login')}>
                    Войти
                  </AuthButton>
                  <AuthButton
                    className="outlined"
                    onClick={() => navigate('/register')}
                  >
                    Регистрация
                  </AuthButton>
                </Box>
              ) : (
                <UserInfo>
                  <NotificationCenter />
                  {userRole !== 'admin' && (
                    <AuthButton 
                      className="outlined"
                      onClick={() => navigate(userRole === 'doctor' ? '/doctor-dashboard' : '/profile')}
                    >
                      Личный кабинет
                    </AuthButton>
                  )}
                  <AuthButton 
                    className="outlined"
                    onClick={handleLogout}
                  >
                    Выйти
                  </AuthButton>
                </UserInfo>
              )}
            </>
          )}
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header; 