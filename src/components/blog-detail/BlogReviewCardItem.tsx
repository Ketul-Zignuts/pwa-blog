import React from 'react'
import {
    Card,
    CardContent,
    Box,
    Typography,
    Avatar,
    Rating,
    IconButton
} from '@mui/material'
import dayjs from 'dayjs'
import { BlogReviewDataProps } from '@/types/blogTypes'
import { useAppSelector } from '@/store'
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { rateReviewDeleteAction } from '@/constants/api/general/general'
import { useConfirm } from '@/hooks/useConfirm'

type BlogReviewCardItemProps = {
    review: BlogReviewDataProps
}

const BlogReviewCardItem = ({ review }: BlogReviewCardItemProps) => {
    const { confirm } = useConfirm();
    const queryClient = useQueryClient();
    const user = useAppSelector((state) => state.auth.user)

    const deleteMutation = useMutation({
        mutationFn: (id: string) => rateReviewDeleteAction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-reviews', review?.post_id] });
        }
    })

    const handleDelete = async (id: string) => {
        const ok = await confirm({
            title: 'Delete Review',
            description: 'This action cannot be undone',
            confirmText: 'Delete'
        })

        if (!ok) return

        deleteMutation.mutate(id)
    }

    return (
        <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 0, position: 'relative' }}>
            {user?.uid === review?.user_uid && (
                <IconButton
                    size='medium'
                    color='error'
                    onClick={() => handleDelete(review?.id)}
                    sx={(theme) => ({
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        backgroundColor: theme.palette.error.main + '20'
                    })}>
                    <DeleteIcon />
                </IconButton>
            )}
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Avatar
                            src={review?.users?.photoURL || ''}
                            alt={review?.users?.displayName}
                        />
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {review?.users?.displayName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {dayjs(review?.created_at).format('DD MMM YYYY')}
                            </Typography>
                        </Box>
                    </Box>
                    <Rating
                        value={review?.rating || 0}
                        precision={0.5}
                        readOnly
                        color="primary"
                    />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.primary">
                        {review?.review}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

export default BlogReviewCardItem
