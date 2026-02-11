'use client'

import { useState } from 'react'
import { IconButton, Tooltip, Chip, Button, Box, Breadcrumbs } from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  adminCategoryDeleteAction,
  adminCategoryListAction
} from '@/constants/api/admin/categories'
import { useConfirm } from '@/hooks/useConfirm'
import { DataTable } from '@/components/common/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
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

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['admin-categories', page, pageSize, search],
    queryFn: async () => {
      const res = await adminCategoryListAction({
        page: page + 1, // API is 1-based
        limit: pageSize,
        search: search || undefined
      })
      return res
    }
  })

  const data: CategoryDataType[] = categoriesData?.data ?? []
  const rowCount = categoriesData?.pagination?.total ?? 0

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminCategoryDeleteAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
    }
  })

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: 'Delete Category',
      description: 'This action cannot be undone',
      confirmText: 'Delete'
    })
    if (isRoAdmin) {
      toast.error(globalConfig?.RO_ADMIN_MESSAGE)
      return
    }

    if (ok) deleteMutation.mutate(id)
  }

  const columns: ColumnDef<CategoryDataType>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'slug', header: 'Slug' },
    {
      accessorKey: 'icon',
      header: 'Icon',
      cell: ({ getValue }) => (
        getValue<boolean>() ? <i className={`${getValue()} text-[22px]`} /> : null
      )
    },
    { accessorKey: 'description', header: 'Description' },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ getValue }) => (
        <Chip
          label={getValue<boolean>() ? 'Active' : 'Inactive'}
          color={getValue<boolean>() ? 'success' : 'error'}
          variant="tonal"
          size="small"
        />
      )
    }
  ]

  return (
    <>
      <AppBreadcrumbs path={path} />
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
            onClick={() => setOpenCategoryForm({ open: true, data: null })}
          >
            Add Category
          </Button>
        )}
        renderRowActions={row => (
          <Box>
            <Tooltip title='Edit'>
              <IconButton
                size='small'
                onClick={() => setOpenCategoryForm({ open: true, data: row })}
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
      <AddCategoryDrawer
        open={openCategoryForm}
        setOpen={setOpenCategoryForm}
      />
    </>
  )
}

export default AdmincategoryView
