import { Skeleton, Box, Stack, Card } from '@mui/material'
import React from 'react'

const TrendingCardSkeleton = () => {
  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        height: 140,
        overflow: 'hidden',
        width: '100%'
      }}
    >
      {/* Image Skeleton */}
      <Skeleton
        variant="rectangular"
        width={140}
        height={140}
        animation="wave"
      />

      {/* Content */}
      <Box sx={{ flex: 1, p: 2 }}>
        {/* Title */}
        <Skeleton variant="text" width="90%" height={28} />
        <Skeleton variant="text" width="75%" height={28} sx={{ mb: 1 }} />

        {/* Excerpt */}
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="85%" height={20} sx={{ mb: 2 }} />

        {/* Bottom Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton variant="circular" width={18} height={18} />
          <Skeleton variant="text" width={40} />

          <Skeleton variant="circular" width={18} height={18} />
          <Skeleton variant="text" width={30} />

          <Box sx={{ flex: 1 }} />

          <Skeleton variant="text" width={60} />
        </Box>
      </Box>
    </Card>
  )
}

const HomeTrendingSkeleton = () => {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 2, pb: 4 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width={200} height={40} />
      </Box>

      {/* 4 Trending Cards */}
      <Stack spacing={4}>
        {Array.from({ length: 4 }).map((_, index) => (
          <TrendingCardSkeleton key={index} />
        ))}
      </Stack>
    </Box>
  )
}

export default HomeTrendingSkeleton
