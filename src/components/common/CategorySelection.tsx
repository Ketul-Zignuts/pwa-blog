'use client'

import { useSettings } from '@/@core/hooks/useSettings'
import { getCategoryTabListAction } from '@/constants/api/general/home/home'
import { useAppDispatch, useAppSelector } from '@/store'
import { setCategoryTab } from '@/store/slices/homeSlice'
import { Box, Skeleton, Tab } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/autoplay'

const CategorySelection = () => {
  const dispatch = useAppDispatch()
  const { settings } = useSettings()
  const isLightMode = settings?.mode === 'light'
  const selectedCategory = useAppSelector(state => state.home.category_id)

  const { data, isLoading } = useQuery({
    queryKey: ['category-tab'],
    queryFn: (params) => getCategoryTabListAction(params)
  })

  const categoryTabData = [
    { name: 'All', value: '', icon: 'ri-apps-line' },
    ...(Array.isArray(data) && data?.length > 0 ? data : [])
  ]

  const handleChange = useCallback((value: string) => {
    if (selectedCategory === value) {
      dispatch(setCategoryTab(''))
    } else {
      dispatch(setCategoryTab(value))
    }
  }, [selectedCategory, dispatch])

  if (isLoading) {
    return (
      <Box sx={{ px: 2, py: 1, display: 'flex', gap: 1, overflow: 'hidden' }}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={idx} variant="rectangular" width={80} height={36} sx={{ borderRadius: '999px' }} />
        ))}
      </Box>
    )
  }

  return (
    <Box sx={{ px: 2, py: 1, overflow: 'hidden' }}>
      <Swiper
        modules={[Autoplay, FreeMode]}
        freeMode={true}
        loop={true}
        autoplay={{
          delay: 200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        speed={2000}
        slidesPerView="auto"
        spaceBetween={8}
        grabCursor={true}
        style={{ paddingBottom: '4px' }}
      >
        {[...categoryTabData, ...categoryTabData].map((category, idx) => (
          <SwiperSlide key={`${category.value}-${idx}`} style={{ width: 'auto' }}>
            <Tab
              value={category.value}
              onClick={() => handleChange(category.value)}
              icon={<i className={category.icon} />}
              iconPosition="start"
              label={category.name}
              sx={(theme) => ({
                textTransform: 'none',
                minHeight: 36,
                borderRadius: '999px',
                px: 2,
                py: 0.5,
                border: '1px solid',
                borderColor: selectedCategory === category.value ? theme.palette.success.main : 'divider',
                backgroundColor: selectedCategory === category.value ? theme.palette.success.main + '20' : 'transparent',
                color: selectedCategory === category.value 
                  ? isLightMode ? theme.palette.success.main : 'success.contrastText'
                  : 'inherit',
                flexShrink: 0
              })}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  )
}

export default CategorySelection
