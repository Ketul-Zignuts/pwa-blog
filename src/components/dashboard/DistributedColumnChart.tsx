'use client'

import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import type { ApexOptions } from 'apexcharts'
import { DashboardSummaryData } from '@/types/dashBoardTypes'

const AppReactApexCharts = dynamic(() => import('@/lib/styles/AppReactApexCharts'))

type Props = {
  summaryData: DashboardSummaryData
  loading: boolean
}

const DistributedColumnChart = ({ summaryData, loading }: Props) => {
  const theme = useTheme()

  const velocity = summaryData?.velocity

  const chartData = [
    velocity?.totalPosts ?? 0,
    velocity?.publishedThisMonth ?? 0,
    velocity?.totalViews ?? 0,
    velocity?.pendingReviews ?? 0,
    Number(velocity?.avgRating ?? 0) * 20
  ]

  const series = [
    {
      name: 'Metrics',
      data: chartData
    }
  ]

  const primaryColor = 'var(--mui-palette-primary-main)'
  const errorColor = 'var(--mui-palette-error-main)'
  const trackBgColor = 'var(--mui-palette-customColors-trackBg)'

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: false,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: { x: { show: false } },
    grid: {
      show: false,
      padding: { top: -10, left: -3, right: -2, bottom: 5 }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: [errorColor, primaryColor, errorColor, primaryColor, primaryColor],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '24%',
        borderRadius: 4,
        distributed: true,
        colors: {
          backgroundBarRadius: 5,
          backgroundBarColors: [
            trackBgColor,
            trackBgColor,
            trackBgColor,
            trackBgColor,
            trackBgColor
          ]
        }
      }
    },
    xaxis: {
      categories: ['Posts', 'Published', 'Views', 'Reviews', 'Rating'],
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { show: false },
    responsive: [
      {
        breakpoint: 900,
        options: {
          plotOptions: { bar: { columnWidth: '18%' } }
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: { bar: { columnWidth: '12%' } }
        }
      }
    ]
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h4'>
          {velocity?.totalPosts ?? 0}
        </Typography>

        <AppReactApexCharts
          type='bar'
          height={88}
          width='100%'
          options={options}
          series={series}
        />

        <Typography color='text.primary' className='font-medium text-center'>
          Content Metrics
        </Typography>
      </CardContent>
    </Card>
  )
}

export default DistributedColumnChart