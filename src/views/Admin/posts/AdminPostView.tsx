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
  IconButton
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useConfirm } from '@/hooks/useConfirm'
import { DataGridTable } from '@/components/common/DataGridTable'
import { adminPostDeleteAction, adminPostListAction } from '@/constants/api/admin/posts'
import { useRouter } from 'next/navigation'
import { PostDataType } from '@/types/postTypes'
import AppBreadcrumbs from '@/components/common/AppBreadcrumbs'

const path = [
  { label: 'Home', href: '/admin/home' },
  { label: 'Posts' }
]

const AdminPostView = () => {
  const { confirm } = useConfirm()
  const queryClient = useQueryClient()
  const router = useRouter()

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')

  // ✅ TANSTACK PATTERN - Works perfectly!
  const handlePaginationChange = useCallback((newModel: GridPaginationModel) => {
    console.log('Pagination change:', newModel)

    // EXACT TanStack pattern: reset page when pageSize changes
    if (newModel.pageSize !== pageSize) {
      setPage(0)  // Always reset to page 0
      setPageSize(newModel.pageSize)
      return
    }

    // Normal page change
    setPage(newModel.page)
  }, [pageSize])

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['admin-posts', page, pageSize, search],
    queryFn: async () => {
      const res = await adminPostListAction({
        page: page + 1,
        limit: pageSize,
        search
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
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
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
      width: 60,
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
      minWidth: 280,
      sortable: true,
      filterable: true,
      renderCell: ({ row }: GridRenderCellParams) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/post-images/${row.hero_image}`}
            alt={row.title}
            variant="rounded"
            sx={{ width: 50, height: 50 }}
          />
          <Typography variant="body2" fontWeight={500} noWrap>
            {row.title}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'slug',
      headerName: 'Slug',
      sortable: true,
      filterable: true,
      minWidth: 200,
    },
    {
      field: 'category',
      headerName: 'Category',
      sortable: true,
      filterable: true,
      minWidth: 200,
      renderCell: ({ row }) => row?.category?.name || '',
    },
    {
      field: 'author',
      headerName: 'Author',
      minWidth: 350,
      sortable: false,
      renderCell: ({ row }: GridRenderCellParams) => {
        const user = row?.user
        return (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={user?.photoURL} alt={user?.displayName} sx={{ width: 50, height: 50 }} />
            <Stack>
              <Typography variant="body2" fontWeight={500}>
                {user?.displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Stack>
          </Stack>
        )
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 180,
      sortable: true,
      filterable: true,
      renderCell: ({ value }: GridRenderCellParams) => (
        <Chip
          label={
            value === 'draft' ? 'Draft' :
              value === 'published' ? 'Published' : 'Archived'
          }
          color={
            value === 'published' ? 'success' :
              value === 'draft' ? 'warning' : 'default'
          }
          variant="tonal"
          size="small"
        />
      ),
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
      minWidth:120,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={
            <Tooltip title="Edit">
              <IconButton size="small" color="primary">
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
              <IconButton size="small" color="error">
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
    <>
    <AppBreadcrumbs path={path} />
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
    </>
  )
}

export default AdminPostView
