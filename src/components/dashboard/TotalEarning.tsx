'use client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { DashboardSummaryData } from '@/types/dashBoardTypes'

type Props = {
  summaryData: DashboardSummaryData
  loading: boolean
}

const TotalEarning = ({ summaryData, loading }: Props) => {
  const velocity = summaryData?.velocity

  const stats = [
    {
      title: 'Total Posts',
      value: velocity?.totalPosts ?? 0,
      icon: 'ri-article-line',
      progress: 100
    },
    {
      title: 'Published This Month',
      value: velocity?.publishedThisMonth ?? 0,
      icon: 'ri-calendar-check-line',
      progress: 80
    },
    {
      title: 'Pending Reviews',
      value: velocity?.pendingReviews ?? 0,
      icon: 'ri-feedback-line',
      progress: 40
    },
    {
      title: 'Total Views',
      value: velocity?.totalViews ?? 0,
      icon: 'ri-eye-line',
      progress: 70
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Blog Performance'
      />

      <CardContent className='flex flex-col gap-12'>
        <div>
          {loading ? (
            <>
              <Skeleton width={140} height={40} />
              <Skeleton width={180} height={20} />
            </>
          ) : (
            <>
              <div className='flex items-center gap-2'>
                <Typography variant='h3'>{velocity?.totalViews ?? 0}</Typography>
                <i
                  className={`ri-arrow-${
                    velocity?.weeklyGrowth >= 0 ? 'up' : 'down'
                  }-s-line ${
                    velocity?.weeklyGrowth >= 0 ? 'text-success' : 'text-error'
                  }`}
                />
                <Typography
                  component='span'
                  color={velocity?.weeklyGrowth >= 0 ? 'success.main' : 'error.main'}
                >
                  {velocity?.weeklyGrowth ?? 0}%
                </Typography>
              </div>

              <Typography>
                Weekly Growth • Avg Rating {velocity?.avgRating ?? '0'}
              </Typography>
            </>
          )}
        </div>
        <div className='flex flex-col gap-3'>
          {(loading ? Array.from({ length: 4 }) : stats).map((item: any, index) => (
            <div key={index} className='flex items-center gap-3'>
              {loading ? (
                <Skeleton variant='rounded' width={40} height={40} />
              ) : (
                <Avatar variant='rounded' className='bg-actionHover'>
                  <i className={`${item.icon} text-[20px]`} />
                </Avatar>
              )}

              <div className='flex justify-between items-center w-full flex-wrap gap-x-4 gap-y-2'>
                <div className='flex flex-col gap-0.5'>
                  {loading ? (
                    <>
                      <Skeleton width={120} />
                      <Skeleton width={80} />
                    </>
                  ) : (
                    <>
                      <Typography color='text.primary' className='font-medium'>
                        {item.title}
                      </Typography>
                      <Typography variant='body2'>Blog Metric</Typography>
                    </>
                  )}
                </div>

                <div className='flex flex-col gap-2 items-center'>
                  {loading ? (
                    <>
                      <Skeleton width={60} />
                      <Skeleton variant='rounded' width={80} height={6} />
                    </>
                  ) : (
                    <>
                      <Typography color='text.primary' className='font-medium'>
                        {item.value}
                      </Typography>

                      <LinearProgress
                        variant='determinate'
                        value={item.progress}
                        className='w-20 h-1'
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TotalEarning