import { useAppDispatch, useAppSelector } from '@/store'
import { setFilterBy, SortByType } from '@/store/slices/filterSlice'
import { Box, Chip } from '@mui/material'
import React from 'react'

const sortByFilter: { value: SortByType; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'most_views', label: 'Most Viewed' },
  { value: 'most_liked', label: 'Most Liked' },
  { value: 'most_commented', label: 'Most Commented' }
]

const SortingFilter = () => {
  const dispatch = useAppDispatch()
  const filterByData = useAppSelector((state) => state.filter.filter)

  const selectSortBy = (value: SortByType) => {
    const newValue =
      filterByData.sort_by === value ? '' : value

    dispatch(
      setFilterBy({
        ...filterByData,
        sort_by: newValue
      })
    )
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap:'wrap' }}>
      {sortByFilter.map((item) => (
        <Chip
          key={item.value}
          variant={'tonal'}
          size='small'
          color={filterByData.sort_by === item.value ? 'success' : 'default'}
          label={item.label}
          onClick={() => selectSortBy(item.value)}
        />
      ))}
    </Box>
  )
}

export default SortingFilter