'use client'

import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useAppSelector } from '@/store'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getMainFeedAction } from '@/constants/api/general/home/home'
import { Box, Typography } from '@mui/material'

const HomeFeed = () => {
  const category_id = useAppSelector((state) => state.home.category_id)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<any>({
    queryKey: ['mainFeed', category_id],
    queryFn: ({ pageParam = 1 }) =>
      getMainFeedAction({ page: (pageParam as any), category_id:(category_id as any) }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  })

  const posts: any[] = data?.pages.flatMap((page) => page.data) ?? []

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<Typography sx={{ textAlign: 'center', py: 2 }}>Loading more...</Typography>}
      scrollableTarget="home-feed-scrollable"
    >
      <Box id="home-feed-scrollable" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {posts.map((post) => (
          <Box key={post.id} sx={{ p: 2, borderBottom: '1px solid #eee' }}>
            <Typography variant="h6">{post.title}</Typography>
            <Typography variant="body2">{post.excerpt}</Typography>
            <Typography variant="caption" color="text.secondary">
              {post.user.displayName} •{' '}
              {new Date(post.published_at).toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Typography>
          </Box>
        ))}

        {isFetchingNextPage && (
          <Typography sx={{ textAlign: 'center', py: 2 }}>Loading more...</Typography>
        )}

        {!hasNextPage && posts.length > 0 && (
          <Typography sx={{ textAlign: 'center', py: 2 }}>No more posts</Typography>
        )}
      </Box>
    </InfiniteScroll>
  )
}

export default HomeFeed
