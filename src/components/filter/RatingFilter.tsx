import { useAppDispatch, useAppSelector } from '@/store'
import { setFilterBy } from '@/store/slices/filterSlice'
import { Box, Rating, Typography, Radio } from '@mui/material'
import React from 'react'

const ratingArray = [5, 4, 3, 2, 1]

const RatingFilter = () => {
  const dispatch = useAppDispatch()
  const filter = useAppSelector((state) => state.filter.filter)

  const handleRating = (value: number) => {
    const newValue = filter.rating === value ? null : value

    dispatch(
      setFilterBy({
        ...filter,
        rating: newValue
      })
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {ratingArray.map((rate) => (
        <Box
          key={rate}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer'
          }}
          onClick={() => handleRating(rate)}
        >
          <Radio
            size="small"
            checked={filter.rating === rate}
            color='success'
          />

          <Rating value={rate} readOnly size="small" />

          <Typography variant="caption">& up</Typography>
        </Box>
      ))}
    </Box>
  )
}

export default RatingFilter