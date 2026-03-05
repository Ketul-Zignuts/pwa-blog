'use client'
import { useSettings } from '@/@core/hooks/useSettings'
import CategoryFilter from '@/components/filter/CategoryFilter'
import FilteredBlog from '@/components/filter/filtered-blog/FilteredBlog'
import RatingFilter from '@/components/filter/RatingFilter'
import SearchFilter from '@/components/filter/SearchFilter'
import SortingFilter from '@/components/filter/SortingFilter'
import HomeNavbar from '@/components/navbar/HomeNavbar'
import { getFilteredBlogAction } from '@/constants/api/general/general'
import { useAppDispatch, useAppSelector } from '@/store'
import { resetFilterBy } from '@/store/slices/filterSlice'
import { FilterInfiniteBlogPage } from '@/types/filterTypes'
import { Box, Button, Container, Divider, Grid, Skeleton, Typography } from '@mui/material'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'

const FilterView = () => {
    const dispatch = useAppDispatch()
    const { settings } = useSettings()
    const isDarkMode = settings?.mode === 'dark'
    const filterByData = useAppSelector((state) => state.filter.filter)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading
    } = useInfiniteQuery<FilterInfiniteBlogPage>({
        queryKey: ['filterBlog', filterByData],
        queryFn: ({ pageParam = 1 }) =>
            getFilteredBlogAction({
                page: pageParam,
                category_id: filterByData?.category_id,
                search: filterByData?.search,
                sort_by: filterByData?.sort_by,
                rating: filterByData?.rating
            }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.hasMore ? allPages.length + 1 : undefined,
        initialPageParam: 1
    })

    const totalBlogs = data?.pages?.[0]?.total ?? 0

    return (
        <Box>
            <HomeNavbar />
            <Container maxWidth='lg'>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8} sx={{ mt: 5, mb: 3 }}>
                        {isLoading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 2, pb: 4 }}>
                                <Skeleton variant="circular" width={32} height={32} />
                                <Skeleton variant="text" width={200} height={40} />
                            </Box>
                        ) : (
                            <Typography variant='h5' fontWeight={600}>Total {totalBlogs} Blog Found</Typography>
                        )}
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={8}
                        id='feed-scroll-container'
                        sx={{
                            maxHeight: 'calc(100vh - 126px)',
                            overflowY: 'auto',
                            pr: 2,
                            paddingTop: '6px !important',

                            scrollbarWidth: 'thin',
                            scrollbarColor: isDarkMode
                                ? 'rgba(255,255,255,0.2) transparent'
                                : 'rgba(0,0,0,0.2) transparent',

                            '&::-webkit-scrollbar': { width: '6px' },
                            '&::-webkit-scrollbar-track': { background: 'transparent' },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: isDarkMode
                                    ? 'rgba(255,255,255,0.2)'
                                    : 'rgba(0,0,0,0.2)',
                                borderRadius: '20px'
                            }
                        }}
                    >
                        <FilteredBlog
                            data={data}
                            isLoading={isLoading}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            paddingTop:'6px !important'
                        }}
                    >
                        <Box
                            sx={{
                                position: 'sticky',
                                top: 90,
                                borderRadius: 2,
                                p: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2
                                }}
                            >
                                <Typography variant='h5' fontWeight={600}>
                                    Filters
                                </Typography>

                                <Button
                                    variant='contained'
                                    size='small'
                                    color='error'
                                    onClick={() => dispatch(resetFilterBy())}
                                >
                                    Clear
                                </Button>
                            </Box>

                            <SearchFilter />

                            <Divider sx={{ my: 3 }} />

                            <Typography variant='h6' fontWeight={600} sx={{ mb: 2 }}>
                                Sort By Category
                            </Typography>
                            <CategoryFilter />

                            <Divider sx={{ my: 3 }} />

                            <Typography variant='h6' fontWeight={600} sx={{ mb: 2 }}>
                                Sort By Order
                            </Typography>
                            <SortingFilter />

                            <Divider sx={{ my: 3 }} />

                            <Typography variant='h6' fontWeight={600} sx={{ mb: 2 }}>
                                Sort By Rating
                            </Typography>
                            <RatingFilter />
                        </Box>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    )
}

export default FilterView