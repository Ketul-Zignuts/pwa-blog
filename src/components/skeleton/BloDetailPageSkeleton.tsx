import { Skeleton, Box, Stack } from '@mui/material'
import React from 'react'

const BlogDetailPageSkeleton = () => {
  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', py: 4 }}>
      
      {/* Hero Image */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={420}
        sx={{ borderRadius: 3 }}
      />

      {/* Author Row */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 3 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width={140} height={20} />
          <Skeleton variant="text" width={100} height={18} />
        </Box>
        <Skeleton
          variant="rectangular"
          width={90}
          height={36}
          sx={{ borderRadius: 2 }}
        />
      </Stack>

      {/* Title */}
      <Box sx={{ mt: 4 }}>
        <Skeleton variant="text" width="85%" height={48} />
        <Skeleton variant="text" width="65%" height={48} />
      </Box>

      {/* Intro Paragraph */}
      <Box sx={{ mt: 2 }}>
        {[...Array(4)].map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={`${100 - i * 5}%`}
            height={24}
          />
        ))}
      </Box>

      {/* Section Image */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={320}
        sx={{ borderRadius: 2, mt: 4 }}
      />

      {/* More From Author Section */}
      <Box sx={{ mt: 6 }}>
        <Skeleton variant="text" width={220} height={32} />

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={200}
              height={180}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

export default BlogDetailPageSkeleton
