'use client'

import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useAppSelector } from '@/store'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getMainFeedAction } from '@/constants/api/general/home/home'
import { Box, Typography, useTheme } from '@mui/material'
import { PostItemDataProps } from '@/types/homeTypes'
import UserPostFeedCard from '@/components/common/UserPostFeedCard'
import { ThreeDots } from 'react-loader-spinner'
import HomeFeedSkeleton from '@/components/skeleton/HomeFeedSkeleton'

const HomeFeed = () => {
  const category_id = useAppSelector((state) => state.home.category_id)
  const theme = useTheme();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['mainFeed', category_id],
    queryFn: ({ pageParam = 1 }) =>
      getMainFeedAction({
        page: pageParam,
        category_id,
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  })

  const posts = data?.pages.flatMap((page) => page.data) ?? []

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[...Array(3)].map((_, index) => (
          <HomeFeedSkeleton key={index} />
        ))}
      </Box>
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
            wrapperStyle={{}}
            wrapperClass=""
          />
        </Box>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {posts?.map((post: PostItemDataProps) => (
          <UserPostFeedCard item={post} key={post?.id} />
        ))}

        {!hasNextPage && posts.length > 0 && (
          <Typography sx={{ textAlign: 'center', py: 2 }}>
            No more posts
          </Typography>
        )}
      </Box>
    </InfiniteScroll>
  )
}

export default HomeFeed
