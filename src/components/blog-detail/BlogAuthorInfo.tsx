'use client'

import { BlogDetailProps } from '@/types/blogTypes'
import {
    Avatar,
    Box,
    Button,
    Stack,
    Typography
} from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import React from 'react'
import dayjs from 'dayjs'

type BlogAuthorInfoProps = {
    blog: BlogDetailProps
}

const BlogAuthorInfo = ({ blog }: BlogAuthorInfoProps) => {
    const publishedDate = blog?.published_at ? dayjs(blog.published_at).format('DD MMM YYYY') : '-'

    return (
        <Box
            sx={{
                mt: 5,
                mb: 5,
                p: 3,
                borderRadius: 1,
                bgcolor: 'background.paper',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
        >
            <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                    src={blog?.user?.photoURL}
                    alt={blog?.user?.displayName}
                    sx={{ width: 40, height: 40 }}
                />
                <Box flex={1}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={0}
                    >
                        <Typography variant="h6" fontWeight={600}>
                            {blog?.user?.displayName}
                        </Typography>
                    </Stack>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={0}
                    >
                        <Typography variant="caption">
                            {blog?.user?.bio}
                        </Typography>
                    </Stack>
                </Box>
                <Button
                    variant="contained"
                    size="small"
                    color='primary'
                >
                    Follow
                </Button>
            </Stack>
            <Stack
                direction="row"
                spacing={3}
                flexDirection={{ xs: 'column', sm: 'row' }}
                sx={{ mt: 3 }}
            >
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <CalendarTodayIcon fontSize="small" />
                    <Typography variant="body2">
                        {publishedDate}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={0.5} alignItems="center">
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="body2">
                        {blog?.read_time} min read
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={0.5} alignItems="center">
                    <VisibilityOutlinedIcon fontSize="small" />
                    <Typography variant="body2">
                        {blog?.views}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={0.5} alignItems="center">
                    <FavoriteBorderIcon fontSize="small" />
                    <Typography variant="body2">
                        {blog?.likes}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={0.5} alignItems="center">
                    <ChatBubbleOutlineIcon fontSize="small" />
                    <Typography variant="body2">
                        {blog?.comments_count}
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    )
}

export default BlogAuthorInfo
