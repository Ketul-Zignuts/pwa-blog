import { getCategoryTabListAction } from '@/constants/api/general/home/home'
import { useAppDispatch, useAppSelector } from '@/store'
import { setFilterBy } from '@/store/slices/filterSlice'
import { Box, Chip, Skeleton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const CategoryFilter = () => {
  const dispatch = useAppDispatch()
  const filterByData = useAppSelector((state) => state.filter.filter)

  const setCategoryFilterTab = (category_id: string) => {
    dispatch(
      setFilterBy({
        ...filterByData,
        category_id: filterByData.category_id === category_id ? '' : category_id
      })
    )
  }

  const { data, isLoading } = useQuery({
    queryKey: ['category-tab'],
    queryFn: (params) => getCategoryTabListAction(params)
  })

  const categoryTabData = [
    { name: 'All', value: '', icon: 'ri-apps-line' },
    ...(Array.isArray(data) ? data : [])
  ]

  if (isLoading) {
    return (
      <Box sx={{ px: 2, py: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {Array.from({ length: 12 }).map((_, idx) => (
          <Skeleton
            key={idx}
            variant="rectangular"
            width={Math.random() * (80 - 40) + 40}
            height={24}
            sx={{ borderRadius: '999px' }}
          />
        ))}
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {categoryTabData.map((category: any, idx: number) => (
        <Chip
          variant={'tonal'}
          key={`${category.value || category.id}-${idx}`}
          size="small"
          label={category.name}
          clickable
          icon={<i className={category.icon} />}
          color={
            filterByData.category_id === category.value ||
            (category.value === 'All' && !filterByData.category_id)
              ? 'success'
              : 'default'
          }
          onClick={() => setCategoryFilterTab(category.value)}
        />
      ))}
    </Box>
  )
}

export default CategoryFilter