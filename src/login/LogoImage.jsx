import { useTheme, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import Logo from '../resources/images/logo.svg?react';
import gpsIcon from '../resources/images/gps3.png';

const useStyles = makeStyles()((theme) => ({
  image: {
    alignSelf: 'center',
    maxWidth: '240px',
    maxHeight: '120px',
    width: 'auto',
    height: 'auto',
    margin: theme.spacing(2),
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    margin: theme.spacing(2),
  },
  gpsIcon: {
    width: '90px',
    height: '90px',
    objectFit: 'contain',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    margin: 0,
  },
}));

const LogoImage = ({ color }) => {
  const theme = useTheme();
  const { classes } = useStyles();

  const expanded = !useMediaQuery(theme.breakpoints.down('lg'));

  const logo = useSelector((state) => state.session.server.attributes?.logo);
  const logoInverted = useSelector((state) => state.session.server.attributes?.logoInverted);

  if (logo) {
    if (expanded && logoInverted) {
      return <img className={classes.image} src={logoInverted} alt="" />;
    }
    return <img className={classes.image} src={logo} alt="" />;
  }
  return (
    <div className={classes.container}>
      <img src={gpsIcon} alt="GPS" className={classes.gpsIcon} />
      <div className={classes.text}>
        <p className={classes.title} style={{ color: color || theme.palette.primary.main }}>ViTracker</p>
        <p className={classes.subtitle} style={{ color: color || theme.palette.text.primary }}>Fleet Management</p>
      </div>
    </div>
  );
};

export default LogoImage;
