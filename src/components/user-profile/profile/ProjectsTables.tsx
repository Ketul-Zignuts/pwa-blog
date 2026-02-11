'use client'

import { useState } from 'react'
import { IconButton, Tooltip, Chip, Button, Box, Avatar, Stack, Typography } from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useConfirm } from '@/hooks/useConfirm'
import { DataTable } from '@/components/common/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import { adminPostDeleteAction } from '@/constants/api/admin/posts'
import { useRouter } from 'next/navigation'
import { PostDataType } from '@/types/postTypes'
import { myPostListAction } from '@/constants/api/profile'

const ProjectsTables = () => {
  const { confirm } = useConfirm()
  const queryClient = useQueryClient()
  const router = useRouter();
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['admin-my-posts', page, pageSize, search],
    queryFn: async () => {
      const res = await myPostListAction({
        page: page + 1,
        limit: pageSize,
        search: search || undefined
      })
      return res
    }
  })

  const data: PostDataType[] = postsData?.data ?? []
  const rowCount = postsData?.pagination?.total ?? 0

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminPostDeleteAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-my-posts'] })
    }
  })

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: 'Delete Post',
      description: 'This action cannot be undone',
      confirmText: 'Delete'
    })

    if (ok) deleteMutation.mutate(id)
  }

  const columns: ColumnDef<PostDataType>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const post: any = row?.original || {}

        return (
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              width: '450px',
              overflow: 'hidden',
            }}
          >
            <Avatar
              src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/post-images/${post?.hero_image}`}
              alt={post?.title}
              variant="rounded"
              sx={{ width: 40, height: 40, flexShrink: 0 }}
            />

            <Typography
              variant="body2"
              fontWeight={500}
              noWrap
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={post?.title} // optional tooltip
            >
              {post?.title}
            </Typography>
          </Stack>
        )
      },
    },

    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const category = row?.original?.category

        return (
          <Typography variant="body2">
            {category?.name}
          </Typography>
        )
      },
    },

    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue<'draft' | 'published' | 'archived'>()

        return (
          <Chip
            label={
              status === 'draft'
                ? 'Draft'
                : status === 'published'
                  ? 'Published'
                  : 'Archived'
            }
            color={
              status === 'published'
                ? 'success'
                : status === 'draft'
                  ? 'warning'
                  : 'default'
            }
            variant="tonal"
            size="small"
          />
        )
      },
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        page={page}
        pageSize={pageSize}
        rowCount={rowCount}
        isLoading={isLoading || deleteMutation.isPending}
        onPageChange={setPage}
        onPageSizeChange={size => {
          setPageSize(size)
          setPage(0)
        }}
        onGlobalFilterChange={value => {
          setSearch(value)
          setPage(0)
        }}
        renderAddAction={() => (
          <Button
            color='primary'
            variant='contained'
            startIcon={<i className='ri-add-line text-[22px]' />}
            onClick={() => router.push('/admin/posts/create')}
          >
            Add Post
          </Button>
        )}
        renderRowActions={row => (
          <Box>
            <Tooltip title='Edit'>
              <IconButton
                size='small'
                onClick={() => router.push(`/admin/posts/${row?.id}`)}
                disabled={deleteMutation.isPending}
                color='primary'
              >
                <i className='ri-edit-line text-[22px]' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton
                size='small'
                onClick={() => handleDelete(row?.id || '')}
                disabled={deleteMutation.isPending}
                color='error'
              >
                <i className='ri-delete-bin-line text-[22px]' />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
    </>
  )
}

export default ProjectsTables
