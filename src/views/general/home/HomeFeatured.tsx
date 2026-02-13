'use client'

import HomeFeaturedSkeleton from '@/components/skeleton/HomeFeaturedSkeleton'
import { getFeaturedPostAction } from '@/constants/api/general/home/home'
import { Box, Typography, Chip, Avatar, Link } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import NextLink from 'next/link'
import dayjs from 'dayjs'

const HomeFeatured = () => {
  const { data: featuredPost, isLoading } = useQuery({
    queryKey: ['featured-post'],
    queryFn: (params: any) => getFeaturedPostAction(params)
  })

  if (isLoading) {
    return <HomeFeaturedSkeleton />
  }

  if (!featuredPost?.data) return null

  const post = featuredPost.data

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box
        component="img"
        src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/post-images/${post?.hero_image}`}
        alt={post.title}
        sx={{
          width: '100%',
          height: 300,
          objectFit: 'cover',
          borderRadius: 2
        }}
      />
      {post?.published_at && (
        <Typography variant="caption" color="text.secondary">
          {dayjs(post.published_at).format('DD MMM, YYYY')}
        </Typography>
      )}
      <Typography
        variant="h5"
        fontWeight={600}
        sx={{ mt: 1, cursor: 'pointer' }}
        component={NextLink}
        href={`/post/${post.slug}`}
      >
        {post?.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {post?.excerpt}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
        <Avatar
          src={post.user.photoURL}
          alt={post.user.displayName}
          sx={{ width: 50, height: 50 }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {post.user.displayName}
          </Typography>
          {post.user.bio && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2, // truncate to 2 lines
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {post.user.bio}
            </Typography>
          )}
        </Box>
      </Box>
      <Link
        component={NextLink}
        href={`/post/${post.slug}`}
        sx={{ mt: 1, fontWeight: 500 }}
      >
        Continue Reading
      </Link>
    </Box>
  )
}

export default HomeFeatured
