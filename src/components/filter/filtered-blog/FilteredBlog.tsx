'use client'

import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { InfiniteData } from '@tanstack/react-query'
import { Box, Card, Skeleton, Stack, Typography, useTheme } from '@mui/material'
import { ThreeDots } from 'react-loader-spinner'
import { motion } from 'framer-motion'
import FilteredBlogCard from '@/components/filter/filtered-blog/FilteredBlogCard'
import { FilterInfiniteBlog, FilterInfiniteBlogPage } from '@/types/filterTypes'
import NoFilterBlogFound from './NoFilterBlogFound'

type Props = {
  data: InfiniteData<FilterInfiniteBlogPage> | undefined
  isLoading: boolean
  fetchNextPage: () => void
  hasNextPage?: boolean
}

// Animation variants for the container to stagger children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delay between each card entrance
    },
  },
}

const FilterCardSkeleton = () => {
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
      <Skeleton
        variant="rectangular"
        width={140}
        height={140}
        animation="wave"
      />
      <Box sx={{ flex: 1, p: 2 }}>
        <Skeleton variant="text" width="90%" height={28} />
        <Skeleton variant="text" width="75%" height={28} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="85%" height={20} sx={{ mb: 2 }} />
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

const FilteredBlog = ({ data, isLoading, fetchNextPage, hasNextPage }: Props) => {
  const theme = useTheme();

  const posts: FilterInfiniteBlog[] = data?.pages.flatMap((page) => page.data) ?? []

  if (isLoading) {
    return (
      <Stack spacing={4}>
        {Array.from({ length: 4 }).map((_, index) => (
          <FilterCardSkeleton key={index} />
        ))}
      </Stack>
    )
  }

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      scrollableTarget="feed-scroll-container"
      loader={
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color={theme?.palette?.primary?.main}
            radius="9"
            ariaLabel="three-dots-loading"
          />
        </Box>
      }
    >
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {Array.isArray(posts) && posts?.length > 0 ? posts?.map((post: FilterInfiniteBlog) => (
          <FilteredBlogCard post={post} key={post?.id} />
        )) : (
          <NoFilterBlogFound />
        )}
      </Box>
    </InfiniteScroll>
  )
}

export default FilteredBlog