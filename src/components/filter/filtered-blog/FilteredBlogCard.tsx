'use client'

import React from 'react'
import NextLink from 'next/link'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
  Avatar,
  Chip,
  Rating,
  Tooltip,
  alpha,
  useTheme
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import { motion, Variants } from 'framer-motion'
import dayjs from 'dayjs'
import { FilterInfiniteBlog } from '@/types/filterTypes'

const MotionCard = motion(Card)

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
}

type Props = {
  post: FilterInfiniteBlog
}

const FilteredBlogCard = ({ post }: Props) => {
  const theme = useTheme()

  return (
    <MotionCard
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      variant="outlined"
      sx={{
        display: 'flex',
        height: 180, // Increased height to fit detailed content
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        borderRadius: 1,
        borderColor: alpha(theme.palette.divider, 0.1),
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(8px)'
      }}
    >
      <CardActionArea
        component={NextLink}
        href={`/blog/${post.slug}`}
        sx={{ display: 'flex', width: '100%', alignItems: 'stretch' }}
      >
        {/* Left Side: Hero Image with Category Overlay */}
        <Box sx={{ position: 'relative', width: 200, overflow: 'hidden' }}>
          <CardMedia
            component="img"
            image={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/post-images/${post.hero_image}`}
            alt={post.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          />
          <Chip
            label={post.category.name}
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              bgcolor: alpha(theme.palette.primary.main, 0.9),
              color: 'white',
              backdropFilter: 'blur(4px)',
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
          />
        </Box>

        {/* Right Side: Content */}
        <CardContent sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
          {/* Header: User Info & Rating */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar 
                src={post.user.photoURL} 
                sx={{ width: 24, height: 24, border: `1px solid ${theme.palette.divider}` }} 
              />
              <Typography variant="caption" fontWeight={600} color="text.primary">
                {post.user.displayName}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Rating value={post.average_rating} readOnly precision={0.5} size="small" />
              <Typography variant="caption" color="text.secondary">
                ({post.average_rating})
              </Typography>
            </Stack>
          </Stack>

          {/* Body: Title & Excerpt */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              lineHeight: 1.2,
              mb: 1,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              color: theme.palette.mode === 'dark' ? '#fff' : '#000'
            }}
          >
            {post.title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 'auto',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {post.excerpt}
          </Typography>

          {/* Footer: Stats & Date */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
            <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
              <VisibilityIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">{post.views.toLocaleString()}</Typography>
            </Stack>
            
            <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
              <FavoriteIcon sx={{ fontSize: 16, color: post.likes > 0 ? '#ff1744' : 'inherit' }} />
              <Typography variant="caption">{post.likes}</Typography>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
              <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">{post.comments_count}</Typography>
            </Stack>

            <Box sx={{ flex: 1 }} />
            
            <Typography variant="caption" sx={{ fontStyle: 'italic', opacity: 0.8 }}>
              {dayjs(post.published_at).format('MMM DD, YYYY')}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </MotionCard>
  )
}

export default FilteredBlogCard