'use client'

import dynamic from 'next/dynamic'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'

import type { ApexOptions } from 'apexcharts'
import { DashBoardRadarChartData } from '@/types/dashBoardTypes'
import { Typography } from '@mui/material'

const AppReactApexCharts = dynamic(() => import('@/lib/styles/AppReactApexCharts'))

type Props = {
  radarChartData: DashBoardRadarChartData[]
  loading: boolean
}

const Performance = ({ radarChartData, loading }: Props) => {

  const divider = 'var(--mui-palette-divider)'
  const textDisabled = 'var(--mui-palette-text-disabled)'

  const labels = radarChartData?.map(item => item.subject) ?? []
  const values = radarChartData?.map(item => item.value) ?? []

  const series = [
    {
      name: 'Score',
      data: values
    }
  ]

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    colors: ['var(--mui-palette-primary-main)'],
    plotOptions: {
      radar: {
        polygons: {
          connectorColors: divider,
          strokeColors: [divider]
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: ['var(--mui-palette-primary-main)'],
        shadeIntensity: 1,
        type: 'vertical',
        opacityFrom: 1,
        opacityTo: 0.9,
        stops: [0, 100]
      }
    },
    labels,
    markers: { size: 4 },
    legend: { show: false },
    grid: { show: false },
    xaxis: {
      labels: {
        show: true,
        style: {
          fontSize: '13px',
          colors: labels.map(() => textDisabled)
        }
      }
    },
    yaxis: { show: false }
  }

  return (
    <Card>

      <CardContent className='flex flex-col gap-8'>
        <Typography variant='h5'>Performance</Typography>
        {loading ? (
          <Skeleton variant='rectangular' height={300} />
        ) : (
          <AppReactApexCharts
            type='radar'
            height={300}
            width='100%'
            series={series}
            options={options}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default Performance