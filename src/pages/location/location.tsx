import Grid from '@mui/material/Grid';
import Location from 'components/sections/dashboard/location';

const Dashboard = () => {
  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>

      <Grid item xs={12}>
        <Location />
      </Grid>
    </Grid>
  );
};

export default Dashboard;