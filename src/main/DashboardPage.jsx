import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SpeedIcon from '@mui/icons-material/Speed';
import RouteIcon from '@mui/icons-material/Route';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import BarChartIcon from '@mui/icons-material/BarChart';
import PageLayout from '../common/components/PageLayout';

const useStyles = makeStyles()((theme) => ({
  root: {
    padding: theme.spacing(4),
    background: theme.palette.background.default,
    minHeight: 'calc(100vh - 64px)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    background: theme.palette.background.paper,
    borderRadius: '12px',
    padding: theme.spacing(3),
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  refreshButton: {
    color: theme.palette.primary.main,
  },
  statCard: {
    borderRadius: '12px',
    padding: theme.spacing(3),
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    },
  },
  statCardContent: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 700,
    color: theme.palette.text.primary,
  },
  statLabel: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  largeCard: {
    borderRadius: '12px',
    padding: theme.spacing(4),
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: theme.spacing(3),
    color: theme.palette.text.primary,
  },
  progressCard: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    background: theme.palette.background.default,
    borderRadius: '8px',
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1.5),
  },
  activityBadge: {
    background: theme.palette.background.paper,
    borderRadius: '12px',
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
    border: `1px solid ${theme.palette.divider}`,
  },
  fuelChart: {
    height: 200,
    display: 'flex',
    alignItems: 'flex-end',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: '8px',
    background: theme.palette.background.default,
  },
  fuelBar: {
    flex: 1,
    background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
    borderRadius: '8px 8px 0 0',
    position: 'relative',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  fuelBarLabel: {
    position: 'absolute',
    top: -25,
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '0.75rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  fuelBarDay: {
    textAlign: 'center',
    marginTop: theme.spacing(1),
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  tableContainer: {
    maxHeight: 400,
    '& .MuiTableCell-root': {
      padding: theme.spacing(1.5),
    },
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.875rem',
  },
  noDataMessage: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
}));

const DashboardPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const devices = useSelector((state) => state.devices.items);
  const positions = useSelector((state) => state.session.positions);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
    unknown: 0,
    moving: 0,
    idle: 0,
    stopped: 0,
    avgSpeed: 0,
    totalDistance: 0,
    activeToday: 0,
  });

  const [topUnitsByMileage, setTopUnitsByMileage] = useState([]);
  const [fuelData, setFuelData] = useState([
    { day: 'Mon', consumption: 0 },
    { day: 'Tue', consumption: 0 },
    { day: 'Wed', consumption: 0 },
    { day: 'Thu', consumption: 0 },
    { day: 'Fri', consumption: 0 },
    { day: 'Sat', consumption: 0 },
    { day: 'Sun', consumption: 0 },
  ]);

  const calculateStats = () => {
    const deviceArray = Object.values(devices);
    const total = deviceArray.length;
    let online = 0;
    let offline = 0;
    let unknown = 0;
    let moving = 0;
    let idle = 0;
    let stopped = 0;
    let totalSpeed = 0;
    let speedCount = 0;
    let totalDistance = 0;
    let activeToday = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    deviceArray.forEach((device) => {
      // Device status
      if (device.status === 'online') online++;
      else if (device.status === 'offline') offline++;
      else unknown++;

      // Position data
      const position = positions[device.id];
      if (position) {
        const speed = position.speed || 0;
        const ignition = position.attributes?.ignition;

        // Movement status
        if (speed > 0) {
          moving++;
        } else if (ignition) {
          idle++;
        } else {
          stopped++;
        }

        // Speed calculation
        if (speed > 0) {
          totalSpeed += speed;
          speedCount++;
        }

        // Distance
        if (position.attributes?.totalDistance) {
          totalDistance += position.attributes.totalDistance;
        }

        // Activity today
        const posTime = new Date(position.fixTime || position.deviceTime || position.serverTime);
        if (posTime >= today) {
          activeToday++;
        }
      }
    });

    setStats({
      total,
      online,
      offline,
      unknown,
      moving,
      idle,
      stopped,
      avgSpeed: speedCount > 0 ? Math.round((totalSpeed / speedCount) * 1.852) : 0, // Convert to km/h
      totalDistance: Math.round(totalDistance / 1000), // Convert to km
      activeToday,
    });

    // Calculate top units by mileage (using total distance from positions)
    const deviceMileages = Object.values(devices).map((device) => {
      const position = positions[device.id];
      const attributes = position?.attributes || {};
      const totalDistance = attributes.totalDistance || 0;
      return {
        id: device.id,
        name: device.name,
        mileage: Math.round(totalDistance / 1000), // Convert to km
        status: device.status,
      };
    }).sort((a, b) => b.mileage - a.mileage).slice(0, 10);

    setTopUnitsByMileage(deviceMileages);
    setLastUpdate(new Date());
  };

  useEffect(() => {
    calculateStats();
  }, [devices, positions]);

  const StatCard = ({ icon, value, label, color, onClick }) => (
    <Card className={classes.statCard} onClick={onClick}>
      <CardContent>
        <Box className={classes.statCardContent}>
          <Box className={classes.iconContainer} sx={{ background: color }}>
            {React.cloneElement(icon, { sx: { fontSize: 32, color: '#ffffff' } })}
          </Box>
          <Box>
            <Typography className={classes.statValue}>{value}</Typography>
            <Typography className={classes.statLabel}>{label}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const StatusProgressBar = ({ label, value, total, color }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
      <Box className={classes.progressCard}>
        <Box className={classes.progressLabel}>
          <Typography variant="body2" fontWeight={600} fontSize="0.95rem" color="text.primary">
            {label}
          </Typography>
          <Typography variant="body2" fontWeight={700} fontSize="1rem" color="text.primary">
            {value} <span style={{ fontSize: '0.85rem', opacity: 0.7, fontWeight: 500 }}>({percentage.toFixed(1)}%)</span>
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', height: 10 }}>
          <Box sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            <Box sx={{
              width: `${percentage}%`,
              height: '100%',
              background: color,
              borderRadius: '8px',
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <PageLayout menu breadcrumbs={['Dashboard']}>
      <div className={classes.root}>
        <Box className={classes.header}>
          <Box className={classes.headerTitle}>
            <Box sx={{
              background: (theme) => theme.palette.primary.main,
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <DashboardIcon sx={{ fontSize: 32, color: '#ffffff' }} />
            </Box>
            <div>
              <Typography variant="h5" fontWeight={700}>
                Fleet Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </Typography>
            </div>
          </Box>
          <Tooltip title="Refresh Data" arrow>
            <IconButton className={classes.refreshButton} onClick={calculateStats}>
              <RefreshIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          {/* Primary Stats */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<DirectionsCarIcon />}
              value={stats.total}
              label="Total Vehicles"
              color="#3b82f6"
              onClick={() => navigate('/')}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<CheckCircleIcon />}
              value={stats.online}
              label="Online Now"
              color="#10b981"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<ErrorIcon />}
              value={stats.offline}
              label="Offline"
              color="#ef4444"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<HelpOutlineIcon />}
              value={stats.unknown}
              label="Unknown"
              color="#f59e0b"
            />
          </Grid>

          {/* Secondary Stats */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<TrendingUpIcon />}
              value={stats.moving}
              label="Moving"
              color="#8b5cf6"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<ScheduleIcon />}
              value={stats.idle}
              label="Idle"
              color="#f59e0b"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<SpeedIcon />}
              value={`${stats.avgSpeed} km/h`}
              label="Avg Speed"
              color="#06b6d4"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<RouteIcon />}
              value={`${stats.totalDistance} km`}
              label="Total Distance"
              color="#ec4899"
            />
          </Grid>

          {/* Detailed Status Breakdown */}
          <Grid item xs={12} md={6}>
            <Card className={classes.largeCard}>
              <CardContent>
                <Typography className={classes.sectionTitle}>Status Breakdown</Typography>
                <StatusProgressBar label="Online" value={stats.online} total={stats.total} color="#10b981" />
                <StatusProgressBar label="Offline" value={stats.offline} total={stats.total} color="#ef4444" />
                <StatusProgressBar label="Unknown" value={stats.unknown} total={stats.total} color="#f59e0b" />
              </CardContent>
            </Card>
          </Grid>

          {/* Movement Breakdown */}
          <Grid item xs={12} md={6}>
            <Card className={classes.largeCard}>
              <CardContent>
                <Typography className={classes.sectionTitle}>Movement Status</Typography>
                <StatusProgressBar label="Moving" value={stats.moving} total={stats.total} color="#8b5cf6" />
                <StatusProgressBar label="Idle" value={stats.idle} total={stats.total} color="#f59e0b" />
                <StatusProgressBar label="Stopped" value={stats.stopped} total={stats.total} color="#64748b" />
                <Box className={classes.activityBadge}>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    {stats.activeToday} of {stats.total} vehicles active today
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Devices with position updates since midnight
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Fuel Consumption Chart */}
          <Grid item xs={12} md={6}>
            <Card className={classes.largeCard}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <LocalGasStationIcon color="primary" />
                  <Typography className={classes.sectionTitle} sx={{ mb: 0 }}>Weekly Fuel Consumption</Typography>
                </Box>
                <Box className={classes.fuelChart}>
                  {fuelData.map((item, index) => {
                    const maxConsumption = Math.max(...fuelData.map(d => d.consumption), 100);
                    const height = maxConsumption > 0 ? (item.consumption / maxConsumption) * 100 : 10;
                    return (
                      <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box 
                          className={classes.fuelBar} 
                          sx={{ 
                            height: `${height}%`,
                            minHeight: item.consumption > 0 ? '10%' : '5%',
                            opacity: item.consumption === 0 ? 0.3 : 1,
                          }}
                        >
                          <Typography className={classes.fuelBarLabel} color="text.primary">
                            {item.consumption > 0 ? `${item.consumption}L` : '-'}
                          </Typography>
                        </Box>
                        <Typography className={classes.fuelBarDay} color="text.secondary">
                          {item.day}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
                {fuelData.every(d => d.consumption === 0) && (
                  <Typography className={classes.noDataMessage}>
                    No fuel data available yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Top Units by Mileage */}
          <Grid item xs={12} md={6}>
            <Card className={classes.largeCard}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <BarChartIcon color="primary" />
                  <Typography className={classes.sectionTitle} sx={{ mb: 0 }}>Top Units by Mileage</Typography>
                </Box>
                {topUnitsByMileage.length > 0 ? (
                  <TableContainer className={classes.tableContainer}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Rank</TableCell>
                          <TableCell>Vehicle</TableCell>
                          <TableCell align="right">Mileage (km)</TableCell>
                          <TableCell align="center">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topUnitsByMileage.map((unit, index) => {
                          const rankColors = ['#fbbf24', '#d1d5db', '#cd7f32'];
                          const rankColor = index < 3 ? rankColors[index] : '#94a3b8';
                          return (
                            <TableRow 
                              key={unit.id}
                              hover
                              sx={{ 
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: 'action.hover' }
                              }}
                              onClick={() => navigate('/')}
                            >
                              <TableCell>
                                <Box 
                                  className={classes.rankBadge}
                                  sx={{ background: rankColor, color: '#ffffff' }}
                                >
                                  {index + 1}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                  {unit.name}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" fontWeight={600}>
                                  {unit.mileage.toLocaleString()}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ 
                                  display: 'inline-block',
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: '12px',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  background: unit.status === 'online' ? '#dcfce7' : unit.status === 'offline' ? '#fee2e2' : '#fef3c7',
                                  color: unit.status === 'online' ? '#166534' : unit.status === 'offline' ? '#991b1b' : '#854d0e',
                                }}>
                                  {unit.status}
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography className={classes.noDataMessage}>
                    No mileage data available yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;
 
