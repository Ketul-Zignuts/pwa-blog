'use client'

import { useState, useCallback } from 'react'
import {
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridActionsCellItem,
  type GridPaginationModel
} from '@mui/x-data-grid'
import {
  Avatar,
  Chip,
  Stack,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Box
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useConfirm } from '@/hooks/useConfirm'
import { DataGridTable } from '@/components/common/DataGridTable'
import { adminPostDeleteAction } from '@/constants/api/admin/posts'
import { useRouter } from 'next/navigation'
import { PostDataType } from '@/types/postTypes'
import { myPostListAction } from '@/constants/api/profile'
import { NoPostIllustration } from '@/components/common/NoPostIllustration'

const MyPostTable = () => {
  const { confirm } = useConfirm()
  const queryClient = useQueryClient()
  const router = useRouter()
  
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')

  // ✅ TANSTACK PATTERN - Exact same pagination handler
  const handlePaginationChange = useCallback((newModel: GridPaginationModel) => {

    if (newModel.pageSize !== pageSize) {
      setPage(0)
      setPageSize(newModel.pageSize)
      return
    }

    setPage(newModel.page)
  }, [pageSize])

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['my-posts', page, pageSize, search],
    queryFn: async () => {
      const res = await myPostListAction({
        page: page + 1,
        limit: pageSize,
        search: search || undefined
      })
      return res
    },
    staleTime: 1000,
    gcTime: 5 * 60 * 1000,
  })

  const data: PostDataType[] = postsData?.data ?? []
  const rowCount = postsData?.pagination?.total ?? 0

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminPostDeleteAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-posts'] })
      setPage(0)
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

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: '#',
      width: 80,
      renderCell: (params: GridRenderCellParams) => {
        const rowIndex = data.findIndex(row => row?.id === params.id)
        const index = page * pageSize + (rowIndex + 1)
        return index
      },
      sortable: false,
      filterable: false,
      editable: false,
      resizable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'title',
      headerName: 'Title',
      minWidth: 250,
      sortable: true,
      filterable: true,
      renderCell: ({ row }: GridRenderCellParams) => {
        const post = row as PostDataType
        return (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
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
                maxWidth: 300,
              }}
              title={post?.title}
            >
              {post?.title}
            </Typography>
          </Stack>
        )
      },
    },
    {
      field: 'category',
      headerName: 'Category',
      minWidth: 250,
      sortable: true,
      filterable: true,
      renderCell: ({ row }: GridRenderCellParams) => {
        const category = row?.category
        return (
          <Typography variant="body2">
            {category?.name || '-'}
          </Typography>
        )
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 180,
      sortable: true,
      filterable: true,
      renderCell: ({ value }: GridRenderCellParams) => {
        const status = value as 'draft' | 'published' | 'archived'
        return (
          <Chip
            label={
              status === 'draft' ? 'Draft' :
              status === 'published' ? 'Published' : 'Archived'
            }
            color={
              status === 'published' ? 'success' :
              status === 'draft' ? 'warning' : 'default'
            }
            variant="tonal"
            size="small"
          />
        )
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      editable: false,
      resizable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      minWidth: 120,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={
            <Tooltip title="Edit">
              <IconButton size="small" color="primary" disabled={deleteMutation.isPending}>
                <i className='ri-edit-line text-[22px]' />
              </IconButton>
            </Tooltip>
          }
          label="Edit"
          onClick={() => router.push(`/admin/posts/${params.id}`)}
          disabled={deleteMutation.isPending}
        />,
        <GridActionsCellItem
          key="delete"
          icon={
            <Tooltip title="Delete">
              <IconButton size="small" color="error" disabled={deleteMutation.isPending}>
                <i className='ri-delete-bin-line text-[22px]' />
              </IconButton>
            </Tooltip>
          }
          label="Delete"
          onClick={() => handleDelete(params.id as string)}
          disabled={deleteMutation.isPending}
        />,
      ],
    },
  ]

  const handleSearchChange = useCallback((value: string) => {
    if (value === search) return
    setPage(0)
    setSearch(value)
  }, [search])

  const addAction = (
    <Button
      variant="contained"
      startIcon={<i className='ri-add-line text-[22px]' />}
      onClick={() => router.push('/admin/posts/create')}
    >
      Add Post
    </Button>
  )

  const paginationModel: GridPaginationModel = { page, pageSize }

  return (
    <DataGridTable
      columns={columns}
      rows={data}
      rowCount={rowCount}
      paginationModel={paginationModel}
      onPaginationModelChange={handlePaginationChange}
      isLoading={isLoading || deleteMutation.isPending}
      addAction={addAction}
      searchValue={search}
      onSearchChange={handleSearchChange}
    />
  )
}

export default MyPostTable
