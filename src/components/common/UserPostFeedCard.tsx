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
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { getRandomMuiColor } from '@/utils/Utils'
import TextEditorContentCropper from './TextEditorContentCropper'
import UserPostItemComment from './UserPostItemComment'

type PostFeedProps = {
  item: PostItemDataProps
}

const UserPostFeedCard = ({ item }: PostFeedProps) => {
  const [showComments, setShowComments] = useState(false)

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
              <FavoriteBorderOutlinedIcon fontSize="small" />
              <Typography variant="caption">{item.likes}</Typography>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconButton
                size="small"
                onClick={() => setShowComments((prev) => !prev)}
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
      <UserPostItemComment showComments={showComments} postId={item?.id} />
    </Card>
  )
}

export default UserPostFeedCard
