import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, IconButton, Menu, MenuItem, Typography, Badge, Avatar, Box, Button, Tooltip,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import MapIcon from '@mui/icons-material/Map';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DevicesIcon from '@mui/icons-material/Devices';
import PlaceIcon from '@mui/icons-material/Place';
import PeopleIcon from '@mui/icons-material/People';
import DriveEtaIcon from '@mui/icons-material/DriveEta';

import { sessionActions } from '../../store';
import { useTranslation } from './LocalizationProvider';
import { useRestriction } from '../util/permissions';
import { nativePostMessage } from './NativeInterface';
import logoImage from '../../resources/images/vslogo.jpg';

const useStyles = makeStyles()((theme) => ({
  appBar: {
    background: theme.palette.mode === 'dark'
      ? 'rgba(26, 26, 46, 0.85)'
      : 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px) saturate(180%)',
    borderBottom: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 30px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.1) inset'
      : '0 4px 30px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.8) inset',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-start', // Changed from space-between to flex-start
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(1, 3),
    minHeight: '70px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 700,
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #FF9502 0%, #FFA726 100%)'
      : 'linear-gradient(135deg, #FF9502 0%, #FB8C00 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  navSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    marginLeft: theme.dimensions.drawerWidthDesktop + 24, // Align just after the sidebar
    flex: 1, // Allow it to grow but not shrink
  },
  navButton: {
    position: 'relative',
    padding: theme.spacing(1, 2),
    borderRadius: '12px',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    color: theme.palette.text.primary,
    minWidth: 'auto',
    '&:hover': {
      background: theme.palette.mode === 'dark'
        ? 'rgba(255, 149, 2, 0.15)'
        : 'rgba(255, 149, 2, 0.08)',
      transform: 'translateY(-2px)',
    },
    '&.active': {
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(255, 149, 2, 0.2) 0%, rgba(255, 167, 38, 0.2) 100%)'
        : 'linear-gradient(135deg, rgba(255, 149, 2, 0.12) 0%, rgba(251, 140, 0, 0.12) 100%)',
      color: theme.palette.mode === 'dark' ? '#FFB74D' : '#F57C00',
      fontWeight: 600,
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: '20%',
        right: '20%',
        height: '3px',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(90deg, #FF9502, #FFA726)'
          : 'linear-gradient(90deg, #FF9502, #FB8C00)',
        borderRadius: '3px 3px 0 0',
      },
    },
  },
  accountSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginLeft: 'auto', // Push to the right
  },
  iconButton: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: theme.palette.mode === 'dark'
        ? 'rgba(255, 149, 2, 0.15)'
        : 'rgba(255, 149, 2, 0.08)',
      transform: 'scale(1.05)',
    },
  },
  avatar: {
    width: 40,
    height: 40,
    background: 'linear-gradient(135deg, #FF9502 0%, #FFA726 100%)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: theme.palette.mode === 'dark'
      ? '2px solid rgba(255, 149, 2, 0.3)'
      : '2px solid rgba(255, 149, 2, 0.2)',
    '&:hover': {
      transform: 'scale(1.1) rotate(5deg)',
      boxShadow: '0 8px 20px rgba(255, 149, 2, 0.4)',
    },
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  userName: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  userEmail: {
    fontSize: '12px',
    opacity: 0.7,
    lineHeight: 1.2,
  },
  menu: {
    '& .MuiPaper-root': {
      marginTop: theme.spacing(1),
      minWidth: 220,
      background: theme.palette.mode === 'dark'
        ? 'rgba(26, 26, 46, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderRadius: '16px',
      border: theme.palette.mode === 'dark'
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : '1px solid rgba(0, 0, 0, 0.08)',
      boxShadow: theme.palette.mode === 'dark'
        ? '0 8px 32px rgba(0, 0, 0, 0.4)'
        : '0 8px 32px rgba(0, 0, 0, 0.12)',
    },
  },
  menuItem: {
    padding: theme.spacing(1.5, 2),
    borderRadius: '8px',
    margin: theme.spacing(0.5, 1),
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: theme.palette.mode === 'dark'
        ? 'rgba(255, 149, 2, 0.15)'
        : 'rgba(255, 149, 2, 0.08)',
      transform: 'translateX(4px)',
    },
  },
}));

const TopNavBar = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useRestriction('readonly');
  const disableReports = useRestriction('disableReports');
  const user = useSelector((state) => state.session.user);
  const socket = useSelector((state) => state.session.socket);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const [accountAnchorEl, setAccountAnchorEl] = useState(null);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    setAccountAnchorEl(null);

    const notificationToken = window.localStorage.getItem('notificationToken');
    if (notificationToken && !user.readonly) {
      window.localStorage.removeItem('notificationToken');
      const tokens = user.attributes.notificationTokens?.split(',') || [];
      if (tokens.includes(notificationToken)) {
        const updatedUser = {
          ...user,
          attributes: {
            ...user.attributes,
            notificationTokens: tokens.length > 1 ? tokens.filter((it) => it !== notificationToken).join(',') : undefined,
          },
        };
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        });
      }
    }

    await fetch('/api/session', { method: 'DELETE' });
    nativePostMessage('logout');
    navigate('/login');
    dispatch(sessionActions.updateUser(null));
  };

  const handleReports = () => {
    if (selectedDeviceId != null) {
      navigate(`/reports/combined?deviceId=${selectedDeviceId}`);
    } else {
      navigate('/reports/combined');
    }
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <AppBar position="fixed" className={classes.appBar} elevation={0}>
      <Toolbar className={classes.toolbar}>
        {/* Logo Section */}
        <Box className={classes.logo} onClick={() => navigate('/')}>
          <img 
            src={logoImage} 
            alt="ViTrack Logo" 
            style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
          />
          <Typography className={classes.logoText}>
            ViTrack
          </Typography>
        </Box>

        {/* Navigation Section */}
        <Box className={classes.navSection}>
          <Button
            className={`${classes.navButton} ${isActive('/dashboard') ? 'active' : ''}`}
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>

          <Button
            className={`${classes.navButton} ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
            startIcon={
              <Badge color="error" variant="dot" overlap="circular" invisible={socket !== false}>
                <MapIcon />
              </Badge>
            }
            onClick={() => navigate('/')}
          >
            {t('mapTitle')}
          </Button>

          {!disableReports && (
            <Button
              className={`${classes.navButton} ${isActive('/reports') ? 'active' : ''}`}
              startIcon={<DescriptionIcon />}
              onClick={handleReports}
            >
              {t('reportTitle')}
            </Button>
          )}

          <Button
            className={`${classes.navButton} ${isActive('/settings/devices') ? 'active' : ''}`}
            startIcon={<DevicesIcon />}
            onClick={() => navigate('/settings/devices')}
          >
            Devices
          </Button>

          <Button
            className={`${classes.navButton} ${isActive('/geofences') ? 'active' : ''}`}
            startIcon={<PlaceIcon />}
            onClick={() => navigate('/geofences')}
          >
            Geofences
          </Button>

          <Button
            className={`${classes.navButton} ${isActive('/settings/drivers') ? 'active' : ''}`}
            startIcon={<DriveEtaIcon />}
            onClick={() => navigate('/settings/drivers')}
          >
            Drivers
          </Button>

          <Button
            className={`${classes.navButton} ${isActive('/settings/users') ? 'active' : ''}`}
            startIcon={<PeopleIcon />}
            onClick={() => navigate('/settings/users')}
          >
            Users
          </Button>
        </Box>

        {/* Account Section */}
        <Box className={classes.accountSection}>
          <Tooltip title="Notifications">
            <IconButton className={classes.iconButton} size="large">
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Box className={classes.userInfo}>
            <Typography className={classes.userName}>
              {user?.name || 'User'}
            </Typography>
            <Typography className={classes.userEmail} variant="body2">
              {user?.email}
            </Typography>
          </Box>

          <Avatar
            className={classes.avatar}
            onClick={(e) => setAccountAnchorEl(e.currentTarget)}
          >
            {getUserInitials()}
          </Avatar>

          <Menu
            className={classes.menu}
            anchorEl={accountAnchorEl}
            open={Boolean(accountAnchorEl)}
            onClose={() => setAccountAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {!readonly && (
              <MenuItem
                className={classes.menuItem}
                onClick={() => {
                  setAccountAnchorEl(null);
                  navigate(`/settings/user/${user.id}`);
                }}
              >
                <PersonIcon sx={{ mr: 1.5 }} />
                <Typography>{t('settingsUser')}</Typography>
              </MenuItem>
            )}
            <MenuItem
              className={classes.menuItem}
              onClick={() => {
                setAccountAnchorEl(null);
                navigate('/settings/preferences?menu=true');
              }}
            >
              <SettingsIcon sx={{ mr: 1.5 }} />
              <Typography>{t('settingsTitle')}</Typography>
            </MenuItem>
            <MenuItem
              className={classes.menuItem}
              onClick={handleLogout}
            >
              <ExitToAppIcon sx={{ mr: 1.5, color: 'error.main' }} />
              <Typography color="error">{t('loginLogout')}</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;
