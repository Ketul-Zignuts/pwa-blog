'use client'

import React from 'react'
import { Box, Typography, Button, Stack, useTheme, alpha } from '@mui/material'
import { motion, Transition } from 'framer-motion' // Added Transition type
import { useAppDispatch } from '@/store'
import { resetFilterBy } from '@/store/slices/filterSlice'
import RestartAltIcon from '@mui/icons-material/RestartAlt'

const NoFilterBlogFound = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()

  // Solution: Use the Transition type to satisfy the Framer Motion props
  const transition: Transition = {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 12,
        px: 3,
        width: '100%',
        minHeight: 500,
        textAlign: 'center'
      }}
    >
      <Box sx={{ position: 'relative', width: 320, height: 260, mb: 2 }}>
        
        {/* 1. Ambient Background Glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.palette.primary.main} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            zIndex: 0
          }}
        />

        <svg
          viewBox="0 0 240 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
        >
          {/* 2. Floating Particles */}
          {[...Array(5)].map((_, i) => (
            <motion.circle
              key={i}
              r={i % 2 === 0 ? 2 : 3}
              fill={theme.palette.primary.main}
              initial={{ x: Math.random() * 200, y: Math.random() * 200, opacity: 0 }}
              animate={{
                y: [0, -40, 0],
                opacity: [0, 0.5, 0],
                x: [0, (i % 2 === 0 ? 20 : -20), 0]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          ))}

          {/* 3. The Main Document */}
          <motion.g
            animate={{ y: [0, -12, 0] }}
            transition={transition}
          >
            <motion.ellipse 
                cx="120" cy="180" rx="40" ry="10" 
                fill="black" opacity="0.1" 
                animate={{ scale: [1, 0.8, 1], opacity: [0.1, 0.05, 0.1] }}
                transition={transition}
            />

            <rect x="70" y="30" width="100" height="130" rx="12" fill={alpha(theme.palette.background.paper, 0.8)} stroke={theme.palette.divider} strokeWidth="2" />
            
            <rect x="85" y="55" width="70" height="6" rx="3" fill={theme.palette.divider} />
            <rect x="85" y="75" width="50" height="6" rx="3" fill={theme.palette.divider} />
            <rect x="85" y="95" width="70" height="6" rx="3" fill={theme.palette.divider} />
            
            <circle cx="120" cy="130" r="15" stroke={theme.palette.error.main} strokeWidth="2" strokeDasharray="4 4" />
            <line x1="113" y1="123" x2="127" y2="137" stroke={theme.palette.error.main} strokeWidth="2" strokeLinecap="round" />
            <line x1="127" y1="123" x2="113" y2="137" stroke={theme.palette.error.main} strokeWidth="2" strokeLinecap="round" />
          </motion.g>

          {/* 4. The Magnifying Glass */}
          <motion.g
            animate={{
              x: [0, 30, -30, 0],
              y: [0, 20, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{ originX: '120px', originY: '110px' }}
          >
            <path d="M145 135L170 160" stroke={theme.palette.text.primary} strokeWidth="8" strokeLinecap="round" />
            <circle cx="120" cy="110" r="35" fill={alpha(theme.palette.primary.main, 0.1)} stroke={theme.palette.text.primary} strokeWidth="4" />
            <path d="M105 95C105 95 110 90 120 90" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
          </motion.g>
        </svg>
      </Box>

      {/* 5. Text & CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Typography variant="h4" fontWeight={800} sx={{ mb: 1.5, background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.6)})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Oops! No Blogs Found
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ maxWidth: 480, mb: 4, mx: 'auto', lineHeight: 1.6, fontSize: '1.1rem' }}
        >
          We searched everywhere but couldn't find any results. 
          Try adjusting your <b>filters</b>, checking your <b>spelling</b>, or clearing your search.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<RestartAltIcon />}
            onClick={() => dispatch(resetFilterBy())}
            sx={{ 
                px: 5, 
                py: 1.5, 
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
                transition: 'all 0.2s ease'
            }}
          >
            Clear All Filters
          </Button>
        </Box>
      </motion.div>
    </Box>
  )
}

export default NoFilterBlogFound