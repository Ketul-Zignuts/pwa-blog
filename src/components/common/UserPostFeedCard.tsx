'use client'

import { PostItemDataProps } from '@/types/homeTypes'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Avatar,
  Stack,
  Chip,
  IconButton,
  Collapse,
  Divider
} from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { getRandomMuiColor } from '@/utils/Utils'
import TextEditorContentCropper from './TextEditorContentCropper'
import UserPostItemComment from './UserPostItemComment'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likePostAction } from '@/constants/api/general/general'
import { useAppSelector } from '@/store'

type PostFeedProps = {
  item: PostItemDataProps
}

const UserPostFeedCard = ({ item }: PostFeedProps) => {
  const user = useAppSelector((state)=>state.auth.user);
  const [showComments, setShowComments] = useState<string | null>(null)
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false)
  const [optimisticLikes, setOptimisticLikes] = useState(item?.likes)

  const { mutate: toggleLike, isPending } = useMutation({
    mutationFn: (likeData: { post_id: string }) => likePostAction(likeData),
    onMutate: async (newLikeData) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['mainFeed'] })
      const previousPosts = queryClient.getQueryData(['mainFeed'])
      
      queryClient.setQueryData(['mainFeed'], (old: any[] | undefined) => 
        old?.map(post => 
          post.id === newLikeData.post_id 
            ? { ...post, likes: isLiked || item?.isLiked ? post.likes - 1 : post.likes + 1 }
            : post
        )
      )

      return { previousPosts }
    },
    onSuccess: (response: any) => {
      if (response.action === 'liked') {
        setIsLiked(true)
      } else {
        setIsLiked(false)
      }
    },
    onError: (err: any, newLikeData, context: any) => {
      // Rollback optimistic update
      queryClient.setQueryData(['mainFeed'], context?.previousPosts)
      const message = err?.response?.data?.message || 'Like action failed!'
      toast.error(message)
      setOptimisticLikes(item.likes)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['mainFeed'] })
    }
  })

  const handleLikeToggle = () => {
    toggleLike({
      post_id: item.id
    })
    
    // Immediate optimistic UI update
    setOptimisticLikes(prev => isLiked || item?.isLiked ? prev - 1 : prev + 1)
    setIsLiked(prev => !prev)
  }

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: 'background.paper',
        mb: 4
      }}
    >
      {/* IMAGE */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/post-images/${item.hero_image}`}
          alt={item.title}
          sx={{
            width: '100%',
            aspectRatio: '16/9',
            objectFit: 'cover'
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0))'
          }}
        />
      </Box>

      <CardContent sx={{ p: 3 }}>
        {/* TITLE */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap-reverse',
            mb: 3,
            mt: 1
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {item.title}
          </Typography>

          <Chip
            label={item.category.name}
            size="small"
            sx={{ borderRadius: '8px !important' }}
            color={getRandomMuiColor()}
            variant="tonal"
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {item.excerpt}
        </Typography>
        <TextEditorContentCropper
          htmlContent={item?.content}
          slug={item?.slug}
          showLines={10}
        />
        <Stack
          direction="row"
          alignItems="flex-end"
          justifyContent="space-between"
          sx={{ color: 'text.secondary', width: '100%', mt: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              src={item.user.photoURL ?? ''}
              sx={{ width: 30, height: 30 }}
            />
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {item.user.displayName}
              </Typography>
              <Typography variant="caption">
                {dayjs(item.published_at).format('DD MMM YYYY')}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <VisibilityOutlinedIcon fontSize="small" />
              <Typography variant="caption">{item.views}</Typography>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconButton
                size="small"
                onClick={handleLikeToggle}
                disabled={isPending || !user}
                sx={{ 
                  color: isLiked || item?.isLiked ? 'error.main' : 'inherit',
                  '&:hover': {
                    backgroundColor: isLiked || item?.isLiked ? 'error.100' : 'action.hover'
                  }
                }}
              >
                {isLiked || item?.isLiked ? (
                  <FavoriteOutlinedIcon fontSize="small" />
                ) : (
                  <FavoriteBorderOutlinedIcon fontSize="small" />
                )}
              </IconButton>
              <Typography variant="caption">{optimisticLikes}</Typography>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconButton
                size="small"
                onClick={() => {
                  setShowComments((prev) =>
                    prev === item.id ? null : item.id
                  )
                }}
              >
                <ChatBubbleOutlineOutlinedIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption">
                {item.comments_count ?? 0}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
      {showComments === item.id && (
        <UserPostItemComment
          showComments={showComments}
          postId={item.id}
        />
      )}
    </Card>
  )
}

export default UserPostFeedCard
