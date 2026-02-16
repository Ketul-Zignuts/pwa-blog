import React, { useEffect } from 'react'
import { Box, Collapse, Divider, Typography, CircularProgress } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { commentPostSchema } from '@/constants/schema/general/homeSchema'
import CustomTextInput from '../form/CustomTextInput'
import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import TelegramIcon from '@mui/icons-material/Telegram';
import { useAppSelector } from '@/store'
import { useRouter } from 'next/navigation'
import { commentGetAction, commentPostAction } from '@/constants/api/general/general'

type UserPostItemCommentProps = {
    showComments: boolean
    postId: string
}

const UserPostItemComment = ({ showComments, postId }: UserPostItemCommentProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const user = useAppSelector((state) => state.auth.user)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteQuery({
        queryKey: ['comments', postId],
        queryFn: ({ pageParam = 1 }) =>
            commentGetAction({ post_id: postId, page: pageParam, limit: 10 }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.pagination.hasMore ? allPages.length + 1 : undefined,
        initialPageParam: 1,
    })

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(commentPostSchema),
        reValidateMode: 'onChange',
        mode: 'all',
        defaultValues: {
            content: ''
        },
    });

    const { mutate, isPending: isPosting } = useMutation({
        mutationFn: (commentData: any) => commentPostAction({...commentData,post_id:postId}),
        onError: (err: any) => {
            const message = err?.response?.data?.message || 'Failed to post comment!'
            toast.error(message)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] })
            queryClient.invalidateQueries({ queryKey: ['mainFeed'] })
            reset({ content: '' })
        }
    })

    const onSubmit = (data: any) => mutate(data)

    return (
        <Collapse in={showComments} timeout="auto" unmountOnExit>
            <Divider />
            <Box
                sx={{
                    maxHeight: 300,
                    overflowY: 'auto',
                    px: 3,
                    py: 2,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {isLoading && <CircularProgress size={24} />}

                {data?.pages?.map((page) =>
                    page.data.map((comment: any) => (
                        <Box key={comment.id} sx={{ mb: 2 }}>
                            <Typography variant="body2" fontWeight={500}>
                                {comment.user.displayName || 'Anonymous'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {comment.content}
                            </Typography>
                        </Box>
                    ))
                )}

                {hasNextPage && (
                    <Typography
                        variant="body2"
                        color="primary"
                        sx={{ cursor: 'pointer', textAlign: 'center' }}
                        onClick={() => fetchNextPage()}
                    >
                        {isFetchingNextPage ? 'Loading...' : 'Load more comments'}
                    </Typography>
                )}
            </Box>

            <Box sx={{ pt: 3, pb: 2, px: 2 }}>
                <CustomTextInput
                    id='content'
                    control={control}
                    name="content"
                    label="Comment"
                    placeholder="Enter comment"
                    fullWidth
                    icon={<TelegramIcon fontSize='large' color='info' />}
                    onIconPress={() => {
                        if (user) {
                            handleSubmit(onSubmit)()
                        } else {
                            router.push('/login')
                        }
                    }}
                    errors={errors}
                    iconTooltipTitle={user ? 'Post comment' : 'Sign in to post a comment'}
                    disabled={isPosting}
                />
            </Box>
        </Collapse>
    )
}

export default UserPostItemComment
