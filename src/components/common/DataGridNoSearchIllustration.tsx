'use client'

import React from 'react'
import { Box, Typography, Button, Stack, useTheme, alpha } from '@mui/material'
import { motion, Transition } from 'framer-motion'
import SearchOffIcon from '@mui/icons-material/SearchOff'

const transition: Transition = {
  duration: 3,
  repeat: Infinity,
  ease: "easeInOut"
}

export const DataGridNoSearchIllustration = ({ onClear }: { onClear?: () => void }) => {
  const theme = useTheme()

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ height: '100%', py: 5, textAlign: 'center' }}
    >
      <Box sx={{ position: 'relative', width: 200, height: 160 }}>
        {/* Scanning Light Effect */}
        <motion.div
          animate={{ x: [-40, 40, -40], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '40%',
            left: '30%',
            width: '40%',
            height: '2px',
            background: theme.palette.primary.main,
            boxShadow: `0 0 15px ${theme.palette.primary.main}`,
            zIndex: 1
          }}
        />

        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Circles */}
          <circle cx="100" cy="80" r="50" fill={alpha(theme.palette.primary.main, 0.05)} />
          
          {/* Animated Magnifying Glass */}
          <motion.g
            animate={{ 
              rotate: [0, 15, -15, 0],
              x: [0, 10, -10, 0],
              y: [0, -5, 5, 0] 
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{ originX: '100px', originY: '80px' }}
          >
            <circle cx="90" cy="70" r="30" stroke={theme.palette.text.secondary} strokeWidth="3" fill={alpha(theme.palette.background.paper, 0.8)} />
            <path d="M112 92L130 110" stroke={theme.palette.text.secondary} strokeWidth="6" strokeLinecap="round" />
            
            {/* Pulsing X inside the glass */}
            <motion.path 
              d="M82 62L98 78M98 62L82 78" 
              stroke={theme.palette.error.main} 
              strokeWidth="3" 
              strokeLinecap="round"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.g>
        </svg>
      </Box>

      <Box>
        <Typography variant="h6" fontWeight={700}>
          No results found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 320 }}>
          We couldn't find anything matching your search. Try different keywords or check for typos.
        </Typography>
        {onClear && (
          <Button
            size="small"
            onClick={onClear}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Clear search query
          </Button>
        )}
      </Box>
    </Stack>
  )
}