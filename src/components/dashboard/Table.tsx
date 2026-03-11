'use client'

import { useState, useCallback } from 'react'
import {
  GridColDef,
  GridRenderCellParams,
  type GridPaginationModel
} from '@mui/x-data-grid'
import { Chip, Avatar, Box, Typography, Paper } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { DataGridTable } from '@/components/common/DataGridTable'
import { dashBoardUserListAction } from '@/constants/api/admin/dashboard'

type DashboardUserType = {
  photoURL: string
  displayName: string
  email: string
  totalPosts: number
  totalComments: number
  totalLikes: number
  followers: number
}

const Table = () => {
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

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['dashboard-users-lists', page, pageSize, search],
    queryFn: async () => {
      const res = await dashBoardUserListAction({
        page: page + 1,
        limit: pageSize,
        search: search || undefined
      })
      return res
    },
    staleTime: 1000,
    gcTime: 5 * 60 * 1000
  })

  const data: DashboardUserType[] = usersData?.data ?? []
  const rowCount = usersData?.pagination?.total ?? 0

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: '#',
      width: 70,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id)
        return page * pageSize + rowIndex + 1
      }
    },

    {
      field: 'user',
      headerName: 'User',
      minWidth: 320,
      sortable: false,
      renderCell: ({ row }: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={row.photoURL} alt={row.displayName} />

          <Box display="flex" flexDirection="column">
            <Typography fontWeight={500}>{row.displayName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Box>
      )
    },

    {
      field: 'totalPosts',
      headerName: 'Posts',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ value }: GridRenderCellParams) => (
        <Chip label={value} color="primary" variant="tonal" size="small" />
      )
    },

    {
      field: 'totalComments',
      headerName: 'Comments',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ value }: GridRenderCellParams) => (
        <Chip label={value} color="info" variant="tonal" size="small" />
      )
    },

    {
      field: 'totalLikes',
      headerName: 'Likes',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ value }: GridRenderCellParams) => (
        <Chip label={value} color="success" variant="tonal" size="small" />
      )
    },

    {
      field: 'followers',
      headerName: 'Followers',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ value }: GridRenderCellParams) => (
        <Chip label={value} color="secondary" variant="tonal" size="small" />
      )
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
    <Box component={Paper} elevation={3}>
      <DataGridTable
        columns={columns}
        rows={data}
        rowCount={rowCount}
        getRowId={(row) => row.email} // unique id
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={handleSearchChange}
        height={460}
      />
    </Box>
  )
}

export default Table