'use client'

import React, { useState } from 'react'
import {
  Box,
  Collapse,
  Divider,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Button,
  ListItemText,
  IconButton
} from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { commentPostSchema } from '@/constants/schema/general/homeSchema'
import CustomTextInput from '@/components/form/CustomTextInput'
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  useQuery
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import TelegramIcon from '@mui/icons-material/Telegram'
import { useAppSelector } from '@/store'
import { useRouter } from 'next/navigation'
import {
  commentDeleteAction,
  commentGetAction,
  commentPostAction
} from '@/constants/api/general/general'
import { useSettings } from '@/@core/hooks/useSettings'
import dayjs from '@/utils/dayJsRelative'
import DeleteIcon from '@mui/icons-material/Delete'
import { useConfirm } from '@/hooks/useConfirm'

type UserPostItemCommentProps = {
  showComments: string
  postId: string
}

const UserPostItemComment = ({
  showComments,
  postId
}: UserPostItemCommentProps) => {
  const { confirm } = useConfirm()
  const { settings } = useSettings()
  const isLightMode = settings?.mode === 'light'
  const router = useRouter()
  const queryClient = useQueryClient()
  const user = useAppSelector((state) => state?.auth?.user)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyingToUser, setReplyingToUser] = useState<any>({})

  const deleteCommentMutation = useMutation({
    mutationFn: (id: string) => commentDeleteAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      queryClient.invalidateQueries({ queryKey: ['replies'] })
      queryClient.invalidateQueries({ queryKey: ['mainFeed'] })
    }
  })

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await commentGetAction({
        post_id: postId,
        page: pageParam,
        limit: 10
      })
      return res
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.pagination?.hasMore
        ? allPages.length + 1
        : undefined,
    initialPageParam: 1
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(commentPostSchema),
    defaultValues: { content: '' }
  })

  const { mutate: postComment, isPending: isPosting } = useMutation({
    mutationFn: (formData: any) =>
      commentPostAction({
        ...formData,
        post_id: postId,
        parent_id: replyingTo
      }),
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        'Failed to post comment'
      toast.error(message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', postId]
      })
      queryClient.invalidateQueries({
        queryKey: ['replies']
      })
      queryClient.invalidateQueries({
        queryKey: ['mainFeed']
      })
      reset({ content: '' })
      setReplyingTo(null)
      setReplyingToUser({})
    }
  })

  const onSubmit = (formData: any) => postComment(formData)

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: 'Delete Comment',
      description: 'This action cannot be undone',
      confirmText: 'Delete'
    })

    if (!ok) return

    deleteCommentMutation.mutate(id)
  }

  const Replies = ({ parentId }: { parentId: string }) => {
    const { data: repliesData, isLoading: repliesLoading } = useQuery({
      queryKey: ['replies', parentId],
      queryFn: async () => {
        const res = await commentGetAction({ parent_id: parentId })
        return res?.data
      },
      enabled: !!parentId
    })

    if (repliesLoading)
      return <CircularProgress size={18} sx={{ ml: 7, my: 1 }} />

    if (!repliesData || repliesData.length === 0) return null

    return (
      <>
        {repliesData.map((reply: any) => (
          <ListItem
            key={reply.id}
            alignItems="flex-start"
            sx={{ pl: 7, py: 0.5 }}
            secondaryAction={
              user?.uid === reply?.user?.uid && (
                <IconButton
                  aria-label="delete reply"
                  color="error"
                  onClick={() => handleDelete(reply.id)}
                  sx={{ width: 40, height: 40 }}
                >
                  <DeleteIcon />
                </IconButton>
              )
            }
          >
            <ListItemAvatar>
              <Avatar
                alt={reply?.user?.displayName}
                src={reply?.user?.photoURL}
                sx={{ width: 30, height: 30 }}
              />
            </ListItemAvatar>

            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  backgroundColor: isLightMode ? '#f5f5f5' : '#4a4466',
                  border: isLightMode ? 'none' : '1px solid #2c2c2c',
                  borderRadius: 3,
                  px: 2,
                  py: 1,
                  display: 'inline-block',
                  maxWidth: user?.uid === reply?.user?.uid ? '94%' : '100%'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {reply?.user?.displayName}
                </Typography>

                <Typography variant="body2">
                  {reply?.content}
                </Typography>
              </Box>

              <Box sx={{ mt: 0.5, ml: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {reply?.created_at
                    ? dayjs(reply.created_at).fromNow()
                    : '-'}
                </Typography>
              </Box>
            </Box>
          </ListItem>
        ))}
      </>
    )
  }

  return (
    <Collapse in={showComments === postId} timeout="auto" unmountOnExit>
      <Divider />
      <Box
        sx={{
          maxHeight: 400,
          overflowY: 'auto',
          px: 2,
          py: 2,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: isLightMode ? '#ccc' : '#4a4466',
            borderRadius: 10
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: isLightMode ? '#fff' : '#121212'
          }
        }}
      >
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={24} />
          </Box>
        )}

        <List sx={{ width: '100%', p: 0 }}>
          {data?.pages?.flatMap((page: any) => page?.data || []).length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <img
                alt="no-comment"
                src="/no-comment.svg"
                height={300}
              />
            </Box>
          ) : (
            data?.pages?.map((page: any) =>
              page?.data?.map((comment: any) => (
                <React.Fragment key={comment.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{ px: 0, py: 1 }}
                    secondaryAction={
                      user?.uid === comment?.user?.uid && (
                        <IconButton
                          aria-label="delete comment"
                          color="error"
                          onClick={() => handleDelete(comment.id)}
                          sx={{ width: 40, height: 40 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={comment?.user?.displayName}
                        src={comment?.user?.photoURL}
                        sx={{ width: 36, height: 36 }}
                      />
                    </ListItemAvatar>

                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          backgroundColor: isLightMode ? '#f0f2f5' : '#2a2640',
                          boxShadow: isLightMode
                            ? 'none'
                            : '0 0 0 1px #3a3555 inset',
                          borderRadius: 3,
                          px: 2,
                          py: 1,
                          display: 'inline-block',
                          maxWidth: user?.uid === comment?.user?.uid ? '90%' : '100%'
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {comment?.user?.displayName}
                        </Typography>

                        <Typography variant="body2">
                          {comment?.content}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          mt: 0.5,
                          display: 'flex',
                          gap: 2,
                          ml: 1
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {comment?.created_at
                            ? dayjs(comment.created_at).fromNow()
                            : '-'}
                        </Typography>

                        {user && (
                          <Typography
                            variant="caption"
                            sx={{
                              cursor: 'pointer',
                              fontWeight: 500,
                              color:
                                replyingToUser?.id === comment?.id
                                  ? 'primary.main'
                                  : isLightMode
                                    ? 'text.secondary'
                                    : '#90caf9',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                            onClick={() => {
                              const isSame = replyingTo === comment.id
                              setReplyingTo(isSame ? null : comment.id)
                              setReplyingToUser(isSame ? {} : comment)
                            }}
                          >
                            {replyingToUser?.id === comment?.id
                              ? 'Hide'
                              : 'Reply'}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </ListItem>

                  <Replies parentId={comment.id} />
                </React.Fragment>
              ))
            )
          )}
        </List>

        {hasNextPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Button
              size="small"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <CircularProgress size={16} />
              ) : (
                'View more comments'
              )}
            </Button>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          pt: 2,
          px: 2,
          pb: 2
        }}
      >
        {replyingToUser?.id && (
          <List sx={{ width: '100%', padding: 0 }}>
            <ListItem alignItems="center" sx={{ p: 0, pl: 2, pb: 2 }}>
              <ListItemAvatar>
                <Avatar
                  alt={replyingToUser?.user?.displayName}
                  src={replyingToUser?.user?.photoURL}
                  sx={{ width: 36, height: 36 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={replyingToUser?.user?.displayName}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: 'text.primary', display: 'inline' }}
                    >
                      Reply To -
                    </Typography>
                    {` ${replyingToUser?.content}`}
                  </React.Fragment>
                }
              />
            </ListItem>
          </List>
        )}
        <CustomTextInput
          id="content"
          control={control}
          name="content"
          label={replyingTo ? 'Reply' : 'Comment'}
          placeholder={
            replyingTo
              ? 'Write a reply...'
              : 'Write a comment...'
          }
          fullWidth
          icon={<TelegramIcon fontSize="medium" color="info" />}
          onIconPress={() => {
            if (user) {
              handleSubmit(onSubmit)()
            } else {
              router.push('/login')
            }
          }}
          errors={errors}
          iconTooltipTitle={
            user
              ? replyingTo
                ? 'Post reply'
                : 'Post comment'
              : 'Sign in to post'
          }
          disabled={isPosting}
        />
      </Box>
    </Collapse>
  )
}

export default UserPostItemComment
