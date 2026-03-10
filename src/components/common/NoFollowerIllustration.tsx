'use client'

import React from 'react'
import { Box, Typography, Stack, useTheme, alpha } from '@mui/material'
import { motion } from 'framer-motion'

export const NoFollowerIllustration = () => {
  const theme = useTheme()

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={3}
      sx={{ height: '100%', py: 8, textAlign: 'center' }}
    >
      <Box sx={{ position: 'relative', width: 220, height: 160 }}>
        <svg viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Layered User Silhouettes with strong opacity */}
          <motion.g 
            animate={{ y: [0, -10, 0] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Back user (faded) */}
            <path 
              d="M130 140c0-22.1-17.9-40-40-40s-40 17.9-40 40h80z" 
              fill={alpha(theme.palette.secondary.main, 0.2)} 
            />
            <circle cx="90" cy="70" r="25" fill={alpha(theme.palette.secondary.main, 0.2)} />
            
            {/* Front user (bold) */}
            <path 
              d="M160 140c0-22.1-17.9-40-40-40s-40 17.9-40 40h80z" 
              fill={alpha(theme.palette.secondary.main, 0.5)} 
            />
            <circle cx="120" cy="70" r="25" fill={alpha(theme.palette.secondary.main, 0.5)} />
          </motion.g>
        </svg>
      </Box>

      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: 'text.primary' }}>
          No followers yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
          You haven't gained any followers yet. Share your content to reach more people!
        </Typography>
      </Box>
    </Stack>
  )
}