'use client'

import React, { useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

type TextEditorContentCropperProps = {
  htmlContent: string | null | undefined
  slug: string
  showLines?: number
  removeImageContent?: boolean
}

const TextEditorContentCropper = ({
  htmlContent,
  slug,
  showLines = 5,
  removeImageContent = true, // default = remove images
}: TextEditorContentCropperProps) => {
  const router = useRouter()

  if (!htmlContent) return null
  
  const processedContent = useMemo(() => {
    if (!removeImageContent) return htmlContent
    
    return htmlContent.replace(/<img[^>]*>/gi, '')
  }, [htmlContent, removeImageContent])

  return (
    <Box sx={{ position: 'relative', mb: 3 }}>
      <Box
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: showLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />

      <Typography
        variant="body2"
        sx={{
          mt: 1,
          fontWeight: 600,
          cursor: 'pointer',
          color: 'primary.main',
          textDecoration: 'underline',
        }}
        onClick={() => router.push(`/blog/${slug}`)}
      >
        Read More
      </Typography>
    </Box>
  )
}

export default TextEditorContentCropper
