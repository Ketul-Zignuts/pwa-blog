'use client'

import dynamic from 'next/dynamic'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import Box from '@mui/material/Box'

import type { ApexOptions } from 'apexcharts'
import { DashboardSummaryData } from '@/types/dashBoardTypes'

const AppReactApexCharts = dynamic(() => import('@/lib/styles/AppReactApexCharts'), { ssr: false })

type Props = {
  summaryData: DashboardSummaryData
  loading: boolean
}

const LineChart = ({ summaryData, loading }: Props) => {
  const primaryColor = 'var(--mui-palette-primary-main)'

  const velocity = summaryData?.velocity

  // Simple sparkline trend (can later come from API)
  const series = [
    {
      data: [
        velocity?.totalViews * 0.3 || 0,
        velocity?.totalViews * 0.45 || 0,
        velocity?.totalViews * 0.55 || 0,
        velocity?.totalViews * 0.7 || 0,
        velocity?.totalViews * 0.85 || 0,
        velocity?.totalViews || 0
      ]
    }
  ]

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: { enabled: false },
    grid: {
      strokeDashArray: 6,
      borderColor: 'var(--mui-palette-divider)',
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: { top: -10, left: -7, right: 5, bottom: 5 }
    },
    stroke: {
      width: 3,
      lineCap: 'butt',
      curve: 'straight'
    },
    colors: [primaryColor],
    markers: {
      size: 6,
      offsetY: 4,
      offsetX: -2,
      strokeWidth: 3,
      colors: ['transparent'],
      strokeColors: 'transparent',
      discrete: [
        {
          size: 5.5,
          seriesIndex: 0,
          strokeColor: primaryColor,
          fillColor: 'var(--mui-palette-background-paper)',
          dataPointIndex: series[0].data.length - 1
        }
      ]
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { labels: { show: false } }
  }

  return (
    <Card>
      <CardContent className='flex flex-col gap-2'>
        {loading ? (
          <>
            <Skeleton width={120} height={40} />
            <Skeleton variant='rounded' height={88} />
            <Skeleton width={100} />
          </>
        ) : (
          <>
            <Box className='flex items-center gap-2'>
              <Typography variant='h4'>
                {velocity?.totalViews ?? 0}
              </Typography>

              <Typography
                variant='body2'
                color={velocity?.weeklyGrowth >= 0 ? 'success.main' : 'error.main'}
                className='flex items-center gap-1'
              >
                <i
                  className={`ri-arrow-${
                    velocity?.weeklyGrowth >= 0 ? 'up' : 'down'
                  }-s-line`}
                />
                {velocity?.weeklyGrowth ?? 0}%
              </Typography>
            </Box>

            <AppReactApexCharts
              type='line'
              height={88}
              width='100%'
              options={options}
              series={series}
            />

            <Typography color='text.primary' className='font-medium text-center'>
              Total Views Growth
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default LineChart