'use client'

import HomeFeaturedSkeleton from '@/components/skeleton/HomeFeaturedSkeleton'
import { getTrendingPostAction } from '@/constants/api/general/home/home'
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  IconButton,
  Stack,
  Link,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import NextLink from 'next/link'
import dayjs from 'dayjs'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FavoriteIcon from '@mui/icons-material/Favorite'

const HomeTrending = () => {
  const { data: trendingPost, isLoading } = useQuery({
    queryKey: ['trending-post'],
    queryFn: (params: any) => getTrendingPostAction(params)
  })

  if (isLoading) {
    return <HomeFeaturedSkeleton />
  }

  if (!trendingPost?.data || trendingPost.data.length === 0) return null

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 2, pb: 4 }}>
        <TrendingUpIcon fontSize='large' color='primary' />
        <Typography variant='h4' fontWeight={600}>
          Trending Posts
        </Typography>
      </Box>
      <Stack spacing={2}>
        {trendingPost.data.map((post: any) => (
          <Card
            key={post.id}
            sx={{
              display: 'flex',
              height: 140,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => theme.shadows[8],
                '& .MuiCardMedia-root': {
                  transform: 'scale(1.05)',
                },
              },
              position: 'relative',
              overflow: 'hidden',
              width:'100%'
            }}
            variant='outlined'
          >
            <CardActionArea
              component={NextLink}
              href={`/blog/${post.slug}`}
              sx={{ height: '100%', display: 'flex', width: '100%' }}
            >
              <CardMedia
                component='img'
                sx={{
                  width: 140,
                  height: 140,
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%)',
                  },
                }}
                image={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/post-images/${post.hero_image}`}
                alt={post.title}
              />
              <CardContent sx={{ flex: 1, p: 2 }}>
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.2,
                    mb:2,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {post.title}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    color: 'text.secondary',
                    mb: 1.5,
                    height: 40,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {post.excerpt}
                </Typography>
                <Stack direction='row' spacing={1} alignItems='center' flexWrap={'wrap'}>
                  <Box sx={{ flex: 1 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8125rem', color: 'text.secondary' }}>
                    <IconButton size='small' sx={{ p: 0.25, color: 'inherit' }}>
                      <VisibilityIcon fontSize='small' />
                    </IconButton>
                    <Typography variant='caption'>{post.views.toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8125rem', color: 'text.secondary' }}>
                    <IconButton size='small' sx={{ p: 0.25, color: 'inherit' }}>
                      <FavoriteIcon fontSize='small' />
                    </IconButton>
                    <Typography variant='caption'>{post.likes}</Typography>
                  </Box>
                  <Typography variant='caption' color='text.secondary'>
                    {dayjs(post.published_at).format('MMM DD')}
                  </Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}

export default HomeTrending
