'use client'
import Grid from '@mui/material/Grid'

// Components Imports
import Award from '@/components/dashboard/Award'
import Transactions from '@/components/dashboard/Transactions'
import WeeklyOverview from '@/components/dashboard/WeeklyOverview'
import TotalEarning from '@/components/dashboard/TotalEarning'
import LineChart from '@/components/dashboard/LineChart'
import DistributedColumnChart from '@/components/dashboard/DistributedColumnChart'
import Performance from '@/components/dashboard/Performance'
import DepositWithdraw from '@/components/dashboard/DepositWithdraw'
import SalesByCountries from '@/components/dashboard/SalesByCountries'
import CardStatVertical from '@/components/dashboard/Vertical'
import Table from '@/components/dashboard/Table'
import { useQuery } from '@tanstack/react-query'
import { chartAction, summaryAction } from '@/constants/api/admin/dashboard'
import { DashBoardChartData } from '@/types/dashBoardTypes'

const AdminHome = () => {
  const { data: summaryData, isLoading: summaryDataLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => summaryAction(),
  })
  const { data: chartData, isLoading: chartDataLoading } = useQuery({
    queryKey: ['dashboard-chart'],
    queryFn: () => chartAction(),
  })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={4}>
        <Award />
      </Grid>
      <Grid item xs={12} md={8} lg={8}>
        <Transactions />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <WeeklyOverview barChartData={Array.isArray(chartData?.barChart) && chartData?.barChart?.length > 0 ? chartData?.barChart : []} loading={chartDataLoading}/>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <TotalEarning summaryData={summaryData} loading={summaryDataLoading} />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <LineChart summaryData={summaryData} loading={summaryDataLoading} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CardStatVertical
              title='Total Views'
              stats={`${summaryData?.velocity?.totalViews ?? 0}`}
              avatarIcon='ri-eye-line'
              avatarColor='secondary'
              subtitle='Weekly Growth'
              trendNumber={`${summaryData?.velocity?.weeklyGrowth ?? 0}%`}
              trend={(summaryData?.velocity?.weeklyGrowth ?? 0) >= 0 ? 'positive' : 'negative'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CardStatVertical
              title='Total Posts'
              stats={`${summaryData?.velocity?.totalPosts ?? 0}`}
              avatarIcon='ri-article-line'
              avatarColor='primary'
              subtitle='Published This Month'
              trendNumber={`${summaryData?.velocity?.publishedThisMonth ?? 0}`}
              trend='positive'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DistributedColumnChart summaryData={summaryData} loading={summaryDataLoading} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Performance radarChartData={Array.isArray(chartData?.radarChart) && chartData?.radarChart?.length > 0 ? chartData?.radarChart : []} loading={chartDataLoading} />
      </Grid>
      <Grid item xs={12} lg={8}>
        <DepositWithdraw />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <SalesByCountries />
      </Grid>
      <Grid item xs={12} md={6} lg={8}>
        <Table />
      </Grid>
    </Grid>
  )
}

export default AdminHome
