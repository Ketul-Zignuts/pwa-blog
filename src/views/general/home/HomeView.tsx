'use client'
import HomeNavbar from '@/components/navbar/HomeNavbar'
import { Grid, Divider, Box, Typography } from '@mui/material'
import React from 'react'
import HomeFeatured from '@/views/general/home/HomeFeatured'
import HomeFeed from '@/views/general/home/HomeFeed'
import HomeTrending from '@/views/general/home/HomeTrending'
import CategorySelection from '@/components/common/CategorySelection'

const HomeView = () => {
  return (
    <Box sx={{ height: '100vh', overflow: 'auto' }}>
      <HomeNavbar />
      <Grid container spacing={0} justifyContent='center'>
        <Grid item xs={12} sx={{ my: 4 }}>
          <CategorySelection />
        </Grid>
      </Grid>
      <Grid container spacing={0} sx={{ height: 'calc(100vh - 140px)', borderTop: '1px solid', borderColor: 'divider', }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={3}
          sx={{
            position: 'sticky',
            top: 0,
            alignSelf: 'flex-start',
            height: { xs: 'auto', sm: 'auto', md: '100%' },
            overflowY: 'auto',
            p: 2,
            borderRight: '1px solid',
            borderColor: 'divider',
            display: { sm: 'none', xs: 'none', md: 'none', lg: 'none', xl: 'block' }
          }}
        >
          <HomeFeatured />
        </Grid>
        <Grid item xs={12} md={8} lg={9} xl={6}
          sx={{
            height: '100%',
            overflowY: 'auto',
            p: 2,
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            borderRight: '1px solid',
            borderColor: 'divider'
          }}
        >
          <HomeFeed />
        </Grid>
        <Grid item xs={12} md={4} lg={3} xl={3}
          sx={{
            height: { xs: 'auto', sm: 'auto', md: '100%' },
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            p: 2
          }}
        >
          <HomeTrending />
        </Grid>
      </Grid>
    </Box>
  )
}

export default HomeView
