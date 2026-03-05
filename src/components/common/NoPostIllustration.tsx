'use client'

import React from 'react'
import { Box, Typography, Button, Stack, useTheme, alpha } from '@mui/material'
import { motion, Transition } from 'framer-motion'
import { useRouter } from 'next/navigation'
import PostAddIcon from '@mui/icons-material/PostAdd'
import { useAppSelector } from '@/store'

const transition: Transition = {
  duration: 3,
  repeat: Infinity,
  ease: "easeInOut"
}

export const NoPostIllustration = () => {
  const theme = useTheme()
  const router = useRouter()
  const isAdminLoggedIn = useAppSelector((state) => state?.auth?.isAdminLoggedIn)

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={3}
      sx={{ height: '100%', py: 5, textAlign: 'center' }}
    >
      <Box sx={{ position: 'relative', width: 200, height: 160 }}>
        {/* Background Glow */}
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 120,
            height: 120,
            background: `radial-gradient(circle, ${theme.palette.primary.main} 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />

        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Floating Document */}
          <motion.g animate={{ y: [0, -10, 0] }} transition={transition}>
            <rect x="60" y="20" width="80" height="110" rx="8" fill={alpha(theme.palette.background.paper, 0.9)} stroke={theme.palette.divider} strokeWidth="2" />
            <rect x="75" y="45" width="50" height="4" rx="2" fill={theme.palette.divider} />
            <rect x="75" y="60" width="40" height="4" rx="2" fill={theme.palette.divider} />
            <rect x="75" y="75" width="50" height="4" rx="2" fill={theme.palette.divider} />
          </motion.g>

          {/* Animated Pencil/Plus Icon */}
          <motion.g
            animate={{ 
              rotate: [0, -10, 10, 0],
              x: [0, 5, -5, 0] 
            }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{ originX: '130px', originY: '100px' }}
          >
            <circle cx="130" cy="110" r="25" fill={theme.palette.primary.main} />
            <path d="M130 100V120M120 110H140" stroke="white" strokeWidth="4" strokeLinecap="round" />
          </motion.g>
        </svg>
      </Box>

      <Box>
        <Typography variant="h6" fontWeight={700}>
          No posts created yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300 }}>
          Your story starts here. Create your first post to see it listed in this table.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<PostAddIcon />}
          onClick={() => router.push(isAdminLoggedIn ? '/admin/posts/create' : '/blog/post')}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Create First Post
        </Button>
      </Box>
    </Stack>
  )
}