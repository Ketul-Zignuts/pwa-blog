import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import CustomAvatar from '@core/components/mui/Avatar';
import { useQuery } from '@tanstack/react-query';
import { statsAction } from '@/constants/api/admin/dashboard';

// Define UI config for your dynamic keys
const statsConfig: Record<string, { icon: string; color: any }> = {
  archive: { icon: 'ri-pie-chart-2-line', color: 'primary' },
  reach: { icon: 'ri-group-line', color: 'success' },
  community: { icon: 'ri-macbook-line', color: 'warning' },
  pipeline: { icon: 'ri-money-dollar-circle-line', color: 'info' }
};

const Transactions = () => {
  const { data: dashboardStatsData, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => statsAction(),
  });

  return (
    <Card className='bs-full'>
      <CardHeader
        title='Transactions'
        subheader={<p className='mbs-3'><span className='font-medium text-textPrimary'>Stats Overview</span></p>}
      />
      <CardContent className='!pbs-5'>
        {isLoading ? (
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={6} md={3} key={i}>
                <div className='flex items-center gap-3'>
                  <Skeleton variant="rounded" width={40} height={40} />
                  <div>
                    <Skeleton width={60} />
                    <Skeleton width={40} height={30} />
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {dashboardStatsData && Object.entries(dashboardStatsData).map(([key, item]: [string, any]) => {
              const config = statsConfig[key];
              return (
                <Grid item xs={6} md={3} key={key}>
                  <div className='flex items-center gap-3'>
                    <CustomAvatar variant='rounded' color={config?.color || 'primary'} className='shadow-xs'>
                      <i className={config?.icon || 'ri-dashboard-line'}></i>
                    </CustomAvatar>
                    <div>
                      <Typography>{item.label}</Typography>
                      <Typography variant='h5'>{item.value}</Typography>
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default Transactions;