'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Avatar from '@mui/material/Avatar'

// Component Imports
import Link from '@components/Link'

// API
import { topActivityAction } from '@/constants/api/admin/dashboard'
import { useQuery } from '@tanstack/react-query'
import { Rating } from '@mui/material'
import { useSettings } from '@/@core/hooks/useSettings'

const DepositWithdraw = () => {
  const { settings } = useSettings();
  const isDarkMode = settings?.mode === 'dark';

  const { data: topActivityData, isLoading } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: () => topActivityAction()
  })

  const commonStyle = {
    scrollBarStyle: {
      scrollbarWidth: 'thin',
      scrollbarColor: isDarkMode
        ? 'rgba(255,255,255,0.2) transparent'
        : 'rgba(0,0,0,0.2) transparent',

      /* Chrome, Edge, Safari */
      '&::-webkit-scrollbar': {
        width: '6px'
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: isDarkMode
          ? 'rgba(255,255,255,0.2)'
          : 'rgba(0,0,0,0.2)',
        borderRadius: '20px',
        transition: 'background-color 0.2s ease'
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: isDarkMode
          ? 'rgba(255,255,255,0.35)'
          : 'rgba(0,0,0,0.35)'
      }
    }
  }

  return (
    <Card>
      <Grid container>
        {/* COMMENTS */}
        <Grid item xs={12} md={6} className='border-be md:border-be-0 md:border-ie'>
          <CardHeader
            title='Recent Comments'
          />

          <CardContent className='flex flex-col gap-5' sx={{
            maxHeight: '330px',
            overflowY: 'auto',
            ...commonStyle.scrollBarStyle
          }}>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='flex items-center gap-4'>
                  <Skeleton variant='circular' width={32} height={32} />
                  <div className='flex justify-between items-center is-full'>
                    <div className='flex flex-col gap-1'>
                      <Skeleton width={120} height={18} />
                      <Skeleton width={220} height={16} />
                    </div>
                    <Skeleton width={60} height={18} />
                  </div>
                </div>
              ))
              : topActivityData?.recentComments?.map((item: any, index: number) => (
                <div key={index} className='flex items-center gap-4'>
                  <Avatar sx={{ width: 30, height: 30 }} src={item?.users?.photoURL} />

                  <div className='flex justify-between items-center is-full flex-wrap gap-x-4 gap-y-2'>
                    <div className='flex flex-col gap-0.5'>
                      <Typography color='text.primary' className='font-medium'>
                        {item.users?.displayName}
                      </Typography>

                      <Typography variant='body2' color='text.secondary'>
                        {item.content.length > 80
                          ? item.content.slice(0, 80) + '...'
                          : item.content}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Grid>

        {/* REVIEWS */}
        <Grid item xs={12} md={6}>
          <CardHeader
            title='Recent Reviews'
          />

          <CardContent className='flex flex-col gap-5' sx={{
            maxHeight: '330px',
            overflowY: 'auto',
            ...commonStyle.scrollBarStyle
          }}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className='flex items-center gap-4'>
                  <Skeleton variant='circular' width={32} height={32} />
                  <div className='flex justify-between items-center is-full'>
                    <div className='flex flex-col gap-1'>
                      <Skeleton width={120} height={18} />
                      <Skeleton width={220} height={16} />
                    </div>
                    <Skeleton width={40} height={18} />
                  </div>
                </div>
              ))
              : topActivityData?.recentReviews?.map((item: any, index: number) => (
                <div key={index} className='flex items-center gap-4'>
                  <Avatar sx={{ width: 30, height: 30 }} src={item?.users?.photoURL} />

                  <div className='flex justify-between items-center is-full flex-wrap gap-x-4 gap-y-2'>
                    <div className='flex flex-col gap-0.5'>
                      <Typography color='text.primary' className='font-medium'>
                        {item.users?.displayName}
                      </Typography>

                      <Typography variant='body2' color='text.secondary'>
                        {item.review.length > 80
                          ? item.review.slice(0, 80) + '...'
                          : item.review}
                      </Typography>
                    </div>

                    <div className='flex items-center gap-1'>
                      <Rating
                        value={Number(item.rating)}
                        precision={0.5}
                        size="small"
                        readOnly
                      />
                      <Typography variant='body2' color='text.secondary'>
                        {item.rating}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default DepositWithdraw