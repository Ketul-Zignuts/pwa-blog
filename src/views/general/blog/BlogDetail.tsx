'use client'
import HomeNavbar from '@/components/navbar/HomeNavbar'
import { postDetailGetAction } from '@/constants/api/general/general'
import { Grid, Box, Container } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import BlogHeroImage from '@/components/blog-detail/BlogHeroImage'
import { BlogDetailProps } from '@/types/blogTypes'
import BlogDetailText from '@/components/blog-detail/BlogDetailText'
import BlogAuthorInfo from '@/components/blog-detail/BlogAuthorInfo'
import BlogContent from '@/components/blog-detail/BlogContent'
import BlogMorePost from '@/components/blog-detail/BlogMorePost'
import BlogDetailPageSkeleton from '@/components/skeleton/BloDetailPageSkeleton'
import BlogReview from '@/components/blog-detail/BlogReview'

type Props = {
  slug: string
}

const BlogDetail = ({ slug }: Props) => {
  const { data: postData, isLoading } = useQuery({
    queryKey: ['blogDetail', slug],
    queryFn: () => postDetailGetAction(slug),
    enabled: !!slug,
  })

  const blogDetailData:BlogDetailProps = postData?.data

  if (isLoading) return (<BlogDetailPageSkeleton />)

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <HomeNavbar showBoxShadow={true} />
      <Container maxWidth="lg" sx={{mt:10}}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <BlogHeroImage blog={blogDetailData} />
            <BlogAuthorInfo blog={blogDetailData} />
            <BlogDetailText blog={blogDetailData} />
            <BlogContent blog={blogDetailData} />
            <BlogMorePost blog={blogDetailData} />
            <Box sx={{mb:10}} />
            <BlogReview blog={blogDetailData} />
            <Box sx={{mb:40}} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default BlogDetail
