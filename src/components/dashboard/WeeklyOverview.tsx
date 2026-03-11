'use client'

import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import type { ApexOptions } from 'apexcharts'
import { DashBoardBarChartData } from '@/types/dashBoardTypes'

const AppReactApexCharts = dynamic(() => import('@/lib/styles/AppReactApexCharts'))

type Props = {
  barChartData: DashBoardBarChartData[]
  loading: boolean
}

const WeeklyOverview = ({ barChartData, loading }: Props) => {
  const theme = useTheme()

  const divider = 'var(--mui-palette-divider)'
  const disabled = 'var(--mui-palette-text-disabled)'

  const categories = barChartData?.map(item => item.day) ?? []
  const seriesData = barChartData?.map(item => item.postCount) ?? []

  const totalPosts = seriesData.reduce((acc, val) => acc + val, 0)

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 7,
        distributed: true,
        columnWidth: '40%'
      }
    },
    stroke: {
      width: 2,
      colors: ['var(--mui-palette-background-paper)']
    },
    legend: { show: false },
    grid: {
      xaxis: { lines: { show: false } },
      strokeDashArray: 7,
      // FIX: Increased left padding to prevent cutoff
      padding: { left: 10, top: -20, bottom: 13 },
      borderColor: divider
    },
    dataLabels: { enabled: false },
    colors: [
      'var(--mui-palette-customColors-trackBg)',
      'var(--mui-palette-customColors-trackBg)',
      'var(--mui-palette-customColors-trackBg)',
      'var(--mui-palette-primary-main)',
      'var(--mui-palette-customColors-trackBg)',
      'var(--mui-palette-customColors-trackBg)',
      'var(--mui-palette-customColors-trackBg)'
    ],
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    },
    xaxis: {
      categories,
      tickPlacement: 'on',
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      // FIX: Ensure only whole numbers are shown
      decimalsInFloat: 0, 
      labels: {
        offsetY: 2,
        // FIX: Adjusted offset to pull label inside the card
        offsetX: -10, 
        style: {
          colors: disabled,
          fontSize: theme.typography.body2.fontSize as string
        }
      }
    }
  }

  return (
    <Card>

      <CardContent className='flex flex-col gap-9' sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        <Typography variant='h5'>Weekly Overview</Typography>
        {loading ? (
          <Skeleton variant='rectangular' height={206} />
        ) : (
          <AppReactApexCharts
            type='bar'
            height={220}
            width='100%'
            series={[{ name: 'Posts', data: seriesData }]}
            options={options}
          />
        )}

        <div className='flex items-center mbe-4 gap-4'>
          {loading ? (
            <Skeleton width={80} height={40} />
          ) : (
            <Typography variant='h4'>{totalPosts}</Typography>
          )}

          <Typography>Posts created this week</Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default WeeklyOverview