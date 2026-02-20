'use client'
import HomeNavbar from '@/components/navbar/HomeNavbar'
import { Grid, Box, } from '@mui/material'
import React from 'react'
import HomeFeatured from '@/views/general/home/HomeFeatured'
import HomeFeed from '@/views/general/home/HomeFeed'
import HomeTrending from '@/views/general/home/HomeTrending'
import CategorySelection from '@/components/common/CategorySelection'
import { useSettings } from '@/@core/hooks/useSettings'
import InstallBlogButton from '@/components/common/InstallBlogButton'

const HomeView = () => {
  const { settings } = useSettings();
  const isDarkMode = settings?.mode === 'dark';

  return (
    <Box sx={{ height: '100vh', overflow: 'auto' }}>
      <HomeNavbar />
      <Grid container spacing={0} justifyContent='center'>
        <Grid item xs={12} sx={{ my: 4 }}>
          <CategorySelection />
        </Grid>
      </Grid>
      <Grid container spacing={0} sx={{ height: 'calc(100vh - 146px)', borderTop: '1px solid', borderColor: 'divider', }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={3.7}
          sx={{
            position: 'sticky',
            top: 0,
            alignSelf: 'flex-start',
            height: { xs: 'auto', sm: 'auto', md: '100%' },
            overflowY: 'auto',
            p: 3,
            borderRight: '1px solid',
            borderColor: 'divider',
            display: { sm: 'none', xs: 'none', md: 'none', lg: 'none', xl: 'block' }
          }}
        >
          <HomeFeatured />
        </Grid>
        <Grid item xs={12} md={12} lg={9} xl={4.6} id="feed-scroll-container"
          sx={{
            height: '100%',
            overflowY: 'auto',
            p: 3,
            borderRight: '1px solid',
            borderColor: 'divider',

            /* Firefox */
            scrollbarWidth: 'thin',
            scrollbarColor: isDarkMode
              ? 'rgba(255,255,255,0.2) transparent'
              : 'rgba(0,0,0,0.2) transparent',

            /* Chrome, Edge, Safari */
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: isDarkMode
                ? 'rgba(255,255,255,0.2)'
                : 'rgba(0,0,0,0.2)',
              borderRadius: '20px',
              transition: 'background-color 0.2s ease'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: isDarkMode
                ? 'rgba(255,255,255,0.35)'
                : 'rgba(0,0,0,0.35)'
            }
          }}
        >
          <HomeFeed />
        </Grid>
        <Grid item xs={12} md={4} lg={3} xl={3.7}
          sx={{
            height: { xs: 'auto', sm: 'auto', md: '100%' },
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            p: 3,
            display: { sm: 'none', xs: 'none', md: 'none', lg: 'block', xl: 'block' }
          }}
        >
          <HomeTrending />
        </Grid>
      </Grid>
      <InstallBlogButton />
    </Box>
  )
}

export default HomeView
