'use client'

import { BlogDetailProps } from '@/types/blogTypes'
import { Box } from '@mui/material'
import React from 'react'

type BlogDetailTextProps = {
  blog: BlogDetailProps
}

const BlogContent = ({ blog }: BlogDetailTextProps) => {
  return (
    <Box
      sx={{
        my: 5,
        '& img': {
          maxWidth: '100%',
          height: 'auto',
        },
        '& iframe': {
          maxWidth: '100%',
        },
        '& table': {
          width: '100%',
          display: 'block',
          overflowX: 'auto',
        },
        '& pre': {
          overflowX: 'auto',
        },
        '& *': {
          maxWidth: '100%',
          wordBreak: 'break-word',
        },
      }}
    >
      <Box
        component="div"
        dangerouslySetInnerHTML={{ __html: blog?.content }}
      />
    </Box>
  )
}

export default BlogContent
