'use client'

import { useState, useCallback } from 'react'
import {
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  type GridPaginationModel
} from '@mui/x-data-grid'

import {
  Avatar,
  Stack,
  Typography,
  Box,
  Chip
} from '@mui/material'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DataGridTable } from '@/components/common/DataGridTable'
import { myFollowerListAction, myFollowerUnFollowAction } from '@/constants/api/profile'
import dayjs from 'dayjs'
import { useConfirm } from '@/hooks/useConfirm'
import { NoFollowerIllustration } from '@/components/common/NoFollowerIllustration'

type FollowerUser = {
  uid: string
  displayName: string
  email: string
  photoURL: string
  bio: string
  followers: number
  following: number
  totalposts: number
}

type FollowerRow = {
  id: string
  created_at: string
  follower: FollowerUser
}

const MyFollowerList = () => {
  const queryClient = useQueryClient();
  const { confirm } = useConfirm();
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')

  const handlePaginationChange = useCallback(
    (newModel: GridPaginationModel) => {
      if (newModel.pageSize !== pageSize) {
        setPage(0)
        setPageSize(newModel.pageSize)
        return
      }

      setPage(newModel.page)
    },
    [pageSize]
  )

  const { data: followersData, isLoading } = useQuery({
    queryKey: ['my-followers', page, pageSize, search],
    queryFn: async () => {
      const res = await myFollowerListAction({
        page: page + 1,
        limit: pageSize,
        search: search || undefined
      })
      return res
    },
    staleTime: 1000,
    gcTime: 5 * 60 * 1000
  })

  const data: FollowerRow[] = followersData?.data ?? []
  const rowCount = followersData?.pagination?.total ?? 0

    const unFollowMutation = useMutation({
    mutationFn: (id: string) => myFollowerUnFollowAction({id}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-followers'] })
      setPage(0)
    }
  })

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: 'Remove Follower',
      description: 'This action cannot be undone',
      confirmText: 'UnFollow'
    })

    if (!ok) return

    unFollowMutation.mutate(id)
  }

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: '#',
      width: 80,
      renderCell: (params: GridRenderCellParams) => {
        const rowIndex = data.findIndex((row) => row?.id === params.id)
        const index = page * pageSize + (rowIndex + 1)
        return index
      },
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center'
    },

    {
      field: 'user',
      headerName: 'User',
      minWidth: 280,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: GridRenderCellParams) => {
        const user = row?.follower

        return (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={user?.photoURL} alt={user?.displayName} />

            <Box sx={{display:'flex',flexDirection:'column',gap:0}}>
              <Typography fontWeight={600}>
                {user?.displayName || '-'}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {user?.bio || user?.email}
              </Typography>
            </Box>
          </Stack>
        )
      }
    },

    {
      field: 'followers',
      headerName: 'Followers',
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      renderCell: ({ row }: GridRenderCellParams) =>
        row?.follower?.followers ?? 0
    },

    {
      field: 'following',
      headerName: 'Following',
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      renderCell: ({ row }: GridRenderCellParams) =>
        row?.follower?.following ?? 0
    },

    {
      field: 'posts',
      headerName: 'Posts',
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      renderCell: ({ row }: GridRenderCellParams) =>
        row?.follower?.totalposts ?? 0
    },

    {
      field: 'created_at',
      headerName: 'Followed At',
      minWidth: 200,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <Typography variant="body2">
            {row?.created_at
              ? dayjs(row?.created_at).format('DD MMM YYYY hh:mm A')
              : '-'}
          </Typography>
        )
      }
    },

    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      getActions: (params: GridRowParams) => [
        <Chip color='info' variant='tonal' label='Remove Follower' onClick={() => handleDelete(params?.id || params?.row?.id || '')} sx={{borderRadius:1}} icon={<i className='ri-user-unfollow-line text-[22px]' />} />
      ]
    }
  ]

  const handleSearchChange = useCallback(
    (value: string) => {
      if (value === search) return
      setPage(0)
      setSearch(value)
    },
    [search]
  )

  const paginationModel: GridPaginationModel = { page, pageSize }

  return (
    <DataGridTable
      columns={columns}
      rows={data}
      rowCount={rowCount}
      paginationModel={paginationModel}
      onPaginationModelChange={handlePaginationChange}
      isLoading={isLoading}
      searchValue={search}
      onSearchChange={handleSearchChange}
      customNoRowsOverlay={<NoFollowerIllustration />}
    />
  )
}

export default MyFollowerList