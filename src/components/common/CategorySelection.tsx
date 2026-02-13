'use client'

import { useSettings } from '@/@core/hooks/useSettings'
import { getCategoryTabListAction } from '@/constants/api/general/home/home'
import { useAppDispatch, useAppSelector } from '@/store'
import { setCategoryTab } from '@/store/slices/homeSlice'
import { Box, Skeleton, Tab } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'

const SCROLL_DURATION = 100

const CategorySelection = () => {
    const dispatch = useAppDispatch()
    const controls = useAnimation()
    const scrollRef = useRef<HTMLDivElement>(null)

    const { settings } = useSettings()
    const isLightMode = settings?.mode === 'light'

    const selectedCategory = useAppSelector(
        state => state.home.category_id
    )

    const { data, isLoading } = useQuery({
        queryKey: ['category-tab'],
        queryFn: (params) => getCategoryTabListAction(params)
    })

    const categoryTabData = [
        { name: 'All', value: '', icon: 'ri-apps-line' },
        ...(Array.isArray(data) && data?.length > 0 ? data : [])
    ]

    const handleChange = (value: string) => {
        if (selectedCategory === value) {
            dispatch(setCategoryTab(''))
            controls.start({
                x: ['0%', '-50%'],
                transition: {
                    repeat: Infinity,
                    ease: 'linear',
                    duration: SCROLL_DURATION
                }
            })
        } else {
            dispatch(setCategoryTab(value))
            controls.stop()
        }
    }

    useEffect(() => {
        if (!selectedCategory) {
            controls.start({
                x: ['0%', '-50%'],
                transition: {
                    repeat: Infinity,
                    ease: 'linear',
                    duration: SCROLL_DURATION
                }
            })
        }
    }, [controls, selectedCategory])

    if (isLoading) {
        return (
            <Box
                sx={{
                    px: 2,
                    py: 1,
                    display: 'flex',
                    gap: 1,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                }}
            >
                {Array.from({ length: 5 }).map((_, idx) => (
                    <Skeleton
                        key={idx}
                        variant="rectangular"
                        width={80}
                        height={36}
                        sx={{ borderRadius: '999px' }}
                    />
                ))}
            </Box>
        )
    }

    return (
        <Box
            sx={{
                px: 2,
                py: 1,
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
            }}
            ref={scrollRef}
            onMouseEnter={() => !selectedCategory && controls.stop()}
            onMouseLeave={() => {
                if (!selectedCategory) {
                    controls.start({
                        x: ['0%', '-50%'],
                        transition: {
                            repeat: Infinity,
                            ease: 'linear',
                            duration: SCROLL_DURATION
                        }
                    })
                }
            }}
        >
            <motion.div
                style={{
                    display: 'flex',
                    gap: 8,
                    width: 'max-content',
                    userSelect: 'none'
                }}
                animate={controls}
            >
                {[...categoryTabData, ...categoryTabData].map((category, index) => (
                    <Tab
                        key={index}
                        value={category.value}
                        onClick={() => handleChange(category.value)}
                        icon={<i className={category.icon} />}
                        iconPosition="start"
                        label={category.name}
                        sx={(theme) => ({
                            textTransform: 'none',
                            minHeight: 36,
                            borderRadius: '999px',
                            px: 2,
                            py: 0.5,
                            border: '1px solid',
                            borderColor:
                                selectedCategory === category.value
                                    ? theme.palette.success.main
                                    : 'divider',
                            backgroundColor:
                                selectedCategory === category.value
                                    ? theme.palette.success.main + '20'
                                    : 'transparent',
                            color:
                                selectedCategory === category.value
                                    ? isLightMode
                                        ? theme.palette.success.main
                                        : 'success.contrastText'
                                    : 'inherit',
                            flexShrink: 0
                        })}
                    />
                ))}
            </motion.div>
        </Box>
    )
}

export default CategorySelection
