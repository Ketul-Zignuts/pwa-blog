'use client'

import { BlogDetailProps } from '@/types/blogTypes'
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { followAuthorAction } from '@/constants/api/general/general'
import { toast } from 'react-toastify'

type BlogAuthorInfoProps = {
    blog: BlogDetailProps
}

const BlogAuthorInfo = ({ blog }: BlogAuthorInfoProps) => {
    const queryClient = useQueryClient();
    const publishedDate = blog?.published_at ? dayjs(blog.published_at).format('DD MMM YYYY') : '-'

    const followMutation = useMutation({
        mutationFn: ({ following_uid }: { following_uid: string }) => followAuthorAction({ following_uid }),
        onError: (err: any) => {
            const message = err?.response?.data?.message || 'Something went wrong!';
            toast.error(message);
        },
        onSuccess: (res) => {
            const isNowFollowing = res?.following
            const authorName = blog?.user?.displayName || 'User'
            const message = isNowFollowing ? `You're now following ${authorName} 🎉` : `You unfollowed ${authorName}`
            toast.success(message)
            queryClient.invalidateQueries({ queryKey: ['blogDetail', blog?.slug] })
        }
    })

    return (
        <Box
            sx={{
                mt: { xs: 3, md: 5 },
                mb: { xs: 3, md: 5 },
                p: { xs: 2, sm: 3 },
                borderRadius: 1,
                bgcolor: 'background.paper',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
        >
            {/* Top Section: Avatar, Name, and Follow Button */}
            <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={{ xs: 2, sm: 3 }} 
                alignItems={{ xs: 'flex-start', sm: 'center' }}
            >
                <Avatar
                    src={blog?.user?.photoURL}
                    alt={blog?.user?.displayName}
                    sx={{ width: 56, height: 56 }} // Increased slightly for better visibility
                />
                
                <Box sx={{ flex: 1, width: '100%' }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                    >
                        <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                            {blog?.user?.displayName}
                        </Typography>
                        
                        {/* Follow Button shows next to name on Mobile to save vertical space */}
                        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <FollowButton blog={blog} followMutation={followMutation} />
                        </Box>
                    </Stack>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: '600px' }}>
                        {blog?.user?.bio}
                    </Typography>
                </Box>

                {/* Follow Button shows at the end on Desktop */}
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <FollowButton blog={blog} followMutation={followMutation} />
                </Box>
            </Stack>

            <Box 
                sx={{ 
                    mt: 3, 
                    pt: 2, 
                    borderTop: '1px solid', 
                    borderColor: 'divider' 
                }}
            >
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    // Small gap on mobile, larger on desktop
                    gap={{ xs: 1.5, sm: 3 }} 
                >
                    <StatItem icon={<CalendarTodayIcon fontSize="inherit" />} label={publishedDate} />
                    <StatItem icon={<AccessTimeIcon fontSize="inherit" />} label={`${blog?.read_time} min read`} />
                    <StatItem icon={<VisibilityOutlinedIcon fontSize="inherit" />} label={blog?.views} />
                    <StatItem icon={<FavoriteBorderIcon fontSize="inherit" />} label={blog?.likes} />
                    <StatItem icon={<ChatBubbleOutlineIcon fontSize="inherit" />} label={blog?.comments_count} />
                </Stack>
            </Box>
        </Box>
    )
}

// Sub-components for cleaner code
const FollowButton = ({ blog, followMutation }: any) => (
    <Button
        variant={blog?.user?.is_following ? "outlined" : "contained"}
        size="small"
        color='info'
        onClick={() => followMutation?.mutate({ following_uid: blog?.user?.uid })}
        startIcon={followMutation?.isPending ? <CircularProgress color='inherit' size={16} /> : null}
        disabled={followMutation?.isPending}
        sx={{ borderRadius: '4px', px: 3, textTransform: 'none', fontWeight: 600 }}
    >
        {blog?.user?.is_following ? 'Unfollow' : 'Follow'}
    </Button>
)

const StatItem = ({ icon, label }: { icon: React.ReactNode, label: string | number | undefined }) => (
    <Stack direction="row" spacing={0.7} alignItems="center" sx={{ color: 'text.secondary' }}>
        <Box sx={{ display: 'flex', fontSize: '1.1rem' }}>{icon}</Box>
        <Typography variant="caption" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
            {label}
        </Typography>
    </Stack>
)

export default BlogAuthorInfo