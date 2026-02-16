import { Skeleton, Box, Card, CardContent, Stack } from '@mui/material'
import React from 'react'

const HomeFeedSkeleton = () => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        mb: 4,
      }}
    >
      {/* Image */}
      <Skeleton
        variant="rectangular"
        width="100%"
        sx={{ aspectRatio: '16/9',height:400 }}
      />

      <CardContent sx={{ p: 3 }}>
        {/* Title */}
        <Skeleton variant="text" width="80%" height={35} />
        <Skeleton variant="text" width="60%" height={35} />

        {/* Excerpt */}
        <Skeleton variant="text" width="100%" height={22} sx={{ mt: 2 }} />
        <Skeleton variant="text" width="95%" height={22} />
        <Skeleton variant="text" width="90%" height={22} />

        {/* Author + Stats */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 3 }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={30} height={30} />
            <Box>
              <Skeleton variant="text" width={100} height={18} />
              <Skeleton variant="text" width={80} height={16} />
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Skeleton variant="text" width={40} />
            <Skeleton variant="text" width={40} />
            <Skeleton variant="text" width={40} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default HomeFeedSkeleton
