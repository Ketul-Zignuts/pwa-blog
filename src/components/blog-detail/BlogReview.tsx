'use client'

import React from 'react'
import { BlogDetailProps, BlogReviewDataProps } from '@/types/blogTypes'
import { Box, Button, CircularProgress } from '@mui/material'
import BlogReviewForm from '@/components/blog-detail/BlogReviewForm'
import { useInfiniteQuery } from '@tanstack/react-query'
import { rateReviewGetAction } from '@/constants/api/general/general'
import BlogReviewCardItem from '@/components/blog-detail/BlogReviewCardItem'
import NoReviewsIllustration from '@/components/blog-detail/NoReviewsIllustration'

type BlogMorePostProps = {
  blog: BlogDetailProps
}

const BlogReview = ({ blog }: BlogMorePostProps) => {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['blog-reviews', blog?.id],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await rateReviewGetAction({
        post_id: blog?.id,
        page: pageParam,
        limit: 10
      })
      return res
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.pagination?.hasMore
        ? allPages.length + 1
        : undefined,
    initialPageParam: 1
  })

  const reviewData:BlogReviewDataProps[] | undefined = data?.pages?.flatMap((page: any) => page?.data || [])

  return (
    <Box className='space-y-4'>
      <BlogReviewForm blog={blog} />
      {Array.isArray(reviewData) && reviewData?.length > 0 ? (
        reviewData?.map((item:BlogReviewDataProps) => {
          return (
            <BlogReviewCardItem review={item} />
          )
        })
      ) : (
        <NoReviewsIllustration />
      )}
      {hasNextPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Button
              size="small"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <CircularProgress size={16} />
              ) : (
                'View more reviews'
              )}
            </Button>
          </Box>
        )}
    </Box>
  )
}

export default BlogReview
