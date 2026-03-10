'use client'

import { BlogDetailProps } from '@/types/blogTypes'
import { Box, CardMedia, Chip, IconButton } from '@mui/material'
import React, { useState } from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import CropFreeIcon from '@mui/icons-material/CropFree';
import { useRouter } from 'next/navigation'
import { Controlled as ControlledZoom } from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

type Props = {
  blog: BlogDetailProps
}

const BlogHeroImage = ({ blog }: Props) => {
  const router = useRouter()
  const [isZoomed, setIsZoomed] = useState(false)

  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/post-images/${blog?.hero_image}`

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 260, sm: 350, md: 450 },
        borderRadius: 1,
        overflow: 'hidden',
        my: 3
      }}
    >
      <ControlledZoom
        isZoomed={isZoomed}
        onZoomChange={(value) => setIsZoomed(value)}
        classDialog="transparent-zoom-overlay"
      >
        <CardMedia
          component="img"
          image={imageUrl}
          alt={blog?.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            pointerEvents: 'none'
          }}
        />
      </ControlledZoom>

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
          pointerEvents: 'none'
        }}
      />

      {/* Back Button */}
      <Chip
        variant="filled"
        color="primary"
        label="Back"
        icon={<KeyboardBackspaceIcon />}
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          borderRadius: 1,
          cursor: 'pointer',
          zIndex: 2
        }}
        onClick={() => router.back()}
      />

      {/* Zoom Icon */}
      <IconButton
        onClick={() => setIsZoomed(true)}
        sx={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          backgroundColor: 'rgba(255,255,255,0.8)',
          '&:hover': { backgroundColor: '#fff' },
          zIndex: 2
        }}
      >
        <CropFreeIcon color="primary" />
      </IconButton>
    </Box>
  )
}

export default BlogHeroImage