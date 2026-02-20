import { BlogDetailProps } from '@/types/blogTypes'
import { Box, CardMedia, Chip } from '@mui/material'
import React from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useRouter } from 'next/navigation';

type Props = {
  blog: BlogDetailProps
}

const BlogHeroImage = ({ blog }: Props) => {
  const router = useRouter();

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
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.3), transparent)',
        }}
      />

      <CardMedia
        component="img"
        image={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/post-images/${blog?.hero_image}`}
        alt={blog?.title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      <Chip
        variant='filled'
        color='primary'
        label='Back'
        icon={<KeyboardBackspaceIcon />}
        sx={{ position: 'absolute', top: 5, left: 5, borderRadius: 1,cursor:'pointer' }}
        onClick={() => router.back()} 
      />
    </Box>
  )
}

export default BlogHeroImage
