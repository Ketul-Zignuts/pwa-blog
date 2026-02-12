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
  Box,
  Breadcrumbs
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  adminCategoryDeleteAction,
  adminCategoryListAction
} from '@/constants/api/admin/categories'
import { useConfirm } from '@/hooks/useConfirm'
import { DataGridTable } from '@/components/common/DataGridTable'
import type { CategoryDataType } from '@/types/categoryTypes'
import AddCategoryDrawer from './AddCategoryDrawer'
import { useAppSelector } from '@/store'
import { toast } from 'react-toastify'
import { globalConfig } from '@/configs/globalConfig'
import AppBreadcrumbs from '@/components/common/AppBreadcrumbs'

const path = [
  { label: 'Home', href: '/admin/home' },
  { label: 'Category' }
]

const AdmincategoryView = () => {
  const { confirm } = useConfirm()
  const queryClient = useQueryClient()
  const isRoAdmin = useAppSelector((state) => state?.auth?.user?.isroadmin)

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [openCategoryForm, setOpenCategoryForm] = useState<{ open: boolean, data: CategoryDataType | null }>({
    open: false,
    data: null
  })

  const handlePaginationChange = useCallback((newModel: GridPaginationModel) => {

    if (newModel.pageSize !== pageSize) {
      setPage(0)
      setPageSize(newModel.pageSize)
      return
    }

    setPage(newModel.page)
  }, [pageSize])

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['admin-categories', page, pageSize, search],
    queryFn: async () => {
      const res = await adminCategoryListAction({
        page: page + 1, // API is 1-based
        limit: pageSize,
        search: search || undefined
      })
      return res
    },
    staleTime: 1000,
    gcTime: 5 * 60 * 1000,
  })

  const data: CategoryDataType[] = categoriesData?.data ?? []
  const rowCount = categoriesData?.pagination?.total ?? 0

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminCategoryDeleteAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      setPage(0)
    }
  })

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: 'Delete Category',
      description: 'This action cannot be undone',
      confirmText: 'Delete'
    })

    if (!ok) return

    if (isRoAdmin) {
      toast.error(globalConfig?.RO_ADMIN_MESSAGE)
      return
    }

    deleteMutation.mutate(id)
  }

  const handleEdit = (row: CategoryDataType) => {
    setOpenCategoryForm({ open: true, data: row })
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
      field: 'name',
      headerName: 'Name',
      minWidth: 250,
      sortable: true,
      filterable: true,
    },
    {
      field: 'slug',
      headerName: 'Slug',
      minWidth: 200,
      sortable: true,
      filterable: true,
    },
    {
      field: 'icon',
      headerName: 'Icon',
      width: 100,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: GridRenderCellParams) => {
        const iconClass = row.icon
        return iconClass ? (
          <i className={`${iconClass} text-[22px]`} />
        ) : null
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 400,
      sortable: true,
      filterable: true,
    },
    {
      field: 'is_active',
      headerName: 'Status',
      minWidth: 190,
      sortable: false,
      filterable: false,
      editable: false,
      resizable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ value }: GridRenderCellParams) => (
        <Chip
          label={value ? 'Active' : 'Inactive'}
          color={value ? 'success' : 'error'}
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
      minWidth: 190,
      getActions: (params: GridRowParams) => {
        const row = params.row as CategoryDataType
        return [
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
            onClick={() => handleEdit(row)}
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
        ]
      },
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
      onClick={() => setOpenCategoryForm({ open: true, data: null })}
    >
      Add Category
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
      <AddCategoryDrawer
        open={openCategoryForm}
        setOpen={setOpenCategoryForm}
      />
    </>
  )
}

export default AdmincategoryView
