import React from 'react'
import { BlogDetailProps } from '@/types/blogTypes'
import { Box, Typography } from '@mui/material'

type BlogDetailTextProps = {
    blog : BlogDetailProps
}

const BlogDetailText = ({blog} : BlogDetailTextProps) => {
  return (
    <Box sx={{display:'flex',flexDirection:'column',gap:2}}>
        <Typography variant='h2'>{blog?.title}</Typography>
        <Typography variant='h6' sx={{color:'secondary.main'}}>{blog?.excerpt}</Typography>
    </Box>
  )
}

export default BlogDetailText