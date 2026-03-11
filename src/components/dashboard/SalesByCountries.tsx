'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'

// Third-party Imports
import classnames from 'classnames'
import CustomAvatar from '@core/components/mui/Avatar'

// API
import { useQuery } from '@tanstack/react-query'
import { topCategoryAction } from '@/constants/api/admin/dashboard'
import React from 'react'
import { Divider } from '@mui/material'

const SalesByCountries = () => {
  const { data: topCategoryData, isLoading } = useQuery({
    queryKey: ['dashboard-top-cat-performer'],
    queryFn: () => topCategoryAction()
  })

  return (
    <Card>
      <CardHeader
        title='Top Categories'
      />

      <CardContent className='flex flex-col gap-3'>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-center gap-4'>
              <Skeleton variant='circular' width={36} height={36} />

              <div className='flex items-center justify-between is-full'>
                <div className='flex flex-col gap-1'>
                  <Skeleton width={120} height={18} />
                  <Skeleton width={160} height={14} />
                </div>

                <div className='flex flex-col gap-1'>
                  <Skeleton width={40} height={18} />
                  <Skeleton width={30} height={14} />
                </div>
              </div>
            </div>
          ))
          : topCategoryData?.map((item: any, index: number) => (
            <React.Fragment key={index}>
              <div className='flex items-center gap-4'>
                <CustomAvatar skin='light'>
                  <i className={item.icon}></i>
                </CustomAvatar>

                <div className='flex items-center justify-between is-full flex-wrap gap-x-4 gap-y-2'>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-1'>
                      <Typography color='text.primary' className='font-medium'>
                        {item.value}
                      </Typography>

                      <div className='flex items-center gap-1'>
                        <i
                          className={classnames(
                            item.isUp
                              ? 'ri-arrow-up-s-line text-success'
                              : 'ri-arrow-down-s-line text-error'
                          )}
                        />

                        <Typography
                          color={item.isUp ? 'success.main' : 'error.main'}
                        >
                          {item.trend}
                        </Typography>
                      </div>
                    </div>

                    <Typography>{item.label}</Typography>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <Typography color='text.primary' className='font-medium'>
                      {item.secondaryValue}
                    </Typography>

                    <Typography variant='body2' color='text.disabled'>
                      Posts
                    </Typography>
                  </div>
                </div>
              </div>
              {index !== topCategoryData.length - 1 && <Divider sx={{ my: 0.4 }} />}
            </React.Fragment>
          ))}
      </CardContent>
    </Card>
  )
}

export default SalesByCountries