import { Skeleton, Box } from '@mui/material'
import React from 'react'

const HomeTrendingSkeleton = () => {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero Image */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={380}
        sx={{ borderRadius: 2 }}
      />

      {/* Content Section */}
      <Box sx={{ mt: 3 }}>
        {/* Date */}
        <Skeleton variant="text" width={120} height={20} />

        {/* Title */}
        <Skeleton variant="text" width="90%" height={40} sx={{ mt: 1 }} />
        <Skeleton variant="text" width="75%" height={40} />

        {/* Excerpt */}
        <Skeleton variant="text" width="100%" height={24} sx={{ mt: 2 }} />
        <Skeleton variant="text" width="95%" height={24} />
        <Skeleton variant="text" width="85%" height={24} />

        {/* Continue Reading */}
        <Skeleton
          variant="text"
          width={140}
          height={30}
          sx={{ mt: 2 }}
        />
      </Box>
    </Box>
  )
}

export default HomeTrendingSkeleton
