import Grid from '@mui/material/Grid';
import CompletedTask from 'components/sections/dashboard/completed-task';

const Dashboard = () => {
  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
      <Grid item xs={12} xl={8}>
        <CompletedTask />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
