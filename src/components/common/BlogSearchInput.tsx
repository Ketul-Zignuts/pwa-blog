'use client'

import React, { useState } from 'react'
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  Typography,
  Avatar,
  Stack,
  InputAdornment,
  ListItemButton,
  ListItem,
  Chip,
  IconButton,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import StarIcon from '@mui/icons-material/Star'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'react-use'
import { blogSearchAction } from '@/constants/api/general/general'
import { useRouter } from 'next/navigation'
import { useSettings } from '@/@core/hooks/useSettings'

type BlogSearchResult = {
  id: string
  title: string
  slug: string
  hero_image?: string
  excerpt?: string
  views?: number
  likes?: number
  comments_count?: number
  average_rating?: number
  category?: {
    id: string
    name: string
    slug: string
  }
  user?: {
    uid: string
    displayName: string
    email?: string
    photoURL?: string
  }
}

const StatItem = ({ icon, label, isDarkMode }: { icon: React.ReactNode; label?: number; isDarkMode: boolean }) => (
  label !== undefined ? (
    <Stack direction='row' spacing={0.5} alignItems='center'>
      {icon}
      <Typography 
        variant='caption' 
        sx={{ 
          fontSize: '11px', 
          color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'text.secondary' 
        }}
      >
        {label}
      </Typography>
    </Stack>
  ) : null
)

const BlogSearchInput = () => {
  const router = useRouter()
  const { settings } = useSettings()
  const isDarkMode = settings?.mode === 'dark'

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useDebounce(() => setDebouncedSearch(search), 500, [search])

  const { data, isFetching } = useQuery({
    queryKey: ['blog-search', debouncedSearch],
    queryFn: () => blogSearchAction({ search: debouncedSearch, page: 1 }),
    enabled: debouncedSearch.length > 1
  })

  const results: BlogSearchResult[] = data?.data ?? []

  const handleNavigation = (slug: string) => {
    setSearch('')
    setDebouncedSearch('')
    router.push(`/blog/${slug}`)
  }

  return (
    <Autocomplete
      freeSolo
      options={results}
      loading={isFetching}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.title
      }
      onInputChange={(_, value) => setSearch(value)}
      onChange={(_, value) => {
        if (value && typeof value !== 'string') {
          handleNavigation(value.slug)
        }
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 1.5,
            borderRadius: '16px',
            backgroundColor: isDarkMode ? '#1e1e2d' : 'background.paper',
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            backgroundImage: 'none',
            boxShadow: isDarkMode 
              ? '0 20px 40px rgba(0,0,0,0.6)' 
              : '0 10px 30px rgba(0,0,0,0.1)',
            '& .MuiAutocomplete-listbox': { p: 0.5 }
          }
        }
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props

        return (
          <ListItem
            key={key}
            {...optionProps}
            disablePadding
            sx={{ 
              p:'0px !important',
              mb: 0.5,
              borderRadius: '12px',
              overflow: 'hidden',
              '&:hover': {
                 backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
              }
            }}
            secondaryAction={
              <IconButton 
                size="small" 
                sx={{ mr: 1, color: isDarkMode ? 'rgba(255,255,255,0.2)' : 'text.disabled' }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleNavigation(option.slug)
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
              </IconButton>
            }
          >
            <ListItemButton sx={{ py: 1.5, px: 1.5, gap: 2 }}>
              <Box sx={{ position: 'relative', flexShrink: 0 }}>
                <Avatar
                  variant='rounded'
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/post-images/${option?.hero_image}`}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '10px',
                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
                  }}
                />
                {option.category && (
                  <Chip
                    label={option.category.name}
                    size='small'
                    sx={{
                      position: 'absolute',
                      top: -6,
                      left: -6,
                      height: 18,
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      backgroundColor: 'primary.main',
                      color: '#fff',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                    }}
                  />
                )}
              </Box>

              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography 
                  variant='body2' 
                  sx={{ 
                    fontWeight: 600, 
                    color: isDarkMode ? '#fff' : 'text.primary', 
                    fontSize: '0.9rem',
                    mb: 0.5 
                  }} 
                  noWrap
                >
                  {option.title}
                </Typography>
                
                <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
                  <Avatar 
                    src={option.user?.photoURL} 
                    sx={{ width: 18, height: 18, border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }} 
                  />
                  <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {option.user?.displayName || 'Unknown Author'}
                  </Typography>

                  {option.average_rating ? (
                    <Stack direction='row' spacing={0.3} alignItems='center' sx={{ ml: 'auto' }}>
                      <StarIcon sx={{ fontSize: 14, color: '#ffb400' }} />
                      <Typography variant='caption' sx={{ fontWeight: 700, color: '#ffb400' }}>
                        {option.average_rating}
                      </Typography>
                    </Stack>
                  ) : null}
                </Stack>

                <Stack direction='row' spacing={2}>
                  <StatItem 
                    isDarkMode={isDarkMode}
                    icon={<VisibilityIcon sx={{ fontSize: 14, color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'text.disabled' }} />} 
                    label={option.views} 
                  />
                  <StatItem 
                    isDarkMode={isDarkMode}
                    icon={<FavoriteBorderIcon sx={{ fontSize: 14, color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'text.disabled' }} />} 
                    label={option.likes} 
                  />
                  <StatItem 
                    isDarkMode={isDarkMode}
                    icon={<ChatBubbleOutlineIcon sx={{ fontSize: 14, color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'text.disabled' }} />} 
                    label={option.comments_count} 
                  />
                </Stack>
              </Box>
            </ListItemButton>
          </ListItem>
        )
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder='Search articles, guides, and more...'
          size='small'
          sx={{
            minWidth: { md: 380, lg: 500 },
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
              transition: 'all 0.2s ease-in-out',
              '& fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
              '&:hover fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main' }
            },
            '& .MuiInputBase-input': {
              color: isDarkMode ? '#fff' : 'text.primary'
            }
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'text.disabled', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {isFetching ? <CircularProgress size={16} sx={{ color: 'primary.main' }} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  )
}

export default BlogSearchInput