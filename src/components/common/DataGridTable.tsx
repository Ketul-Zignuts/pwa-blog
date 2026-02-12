'use client'

import {
  DataGrid,
  GridColDef,
  GridRowId,
  type GridValidRowModel,
  type GridPaginationModel,
} from '@mui/x-data-grid'
import { ReactNode } from 'react'
import { Box, Stack, Toolbar } from '@mui/material'
import { DebouncedInput } from '@/components/common/DebouncedInput'

interface DataGridTableProps<T extends GridValidRowModel> {
  columns: GridColDef<T>[]
  rows: T[]
  rowCount: number
  paginationModel: GridPaginationModel
  onPaginationModelChange: (model: GridPaginationModel) => void
  isLoading?: boolean
  addAction?: ReactNode
  height?: number
  getRowId?: (row: T) => GridRowId
  searchValue?: string
  onSearchChange?: (value: string) => void
  rowHeight?: number
}

export function DataGridTable<T extends GridValidRowModel>({
  columns,
  rows,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  isLoading,
  addAction,
  height = 700,
  getRowId,
  searchValue,
  onSearchChange,
  rowHeight = 52
}: DataGridTableProps<T>) {

  const CustomToolbar = () => (
    <Toolbar aria-label="Table toolbar">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        px={1}
      >
        {/* LEFT - Search */}
        <Box sx={{ minWidth: 250 }}>
          <DebouncedInput
            value={searchValue ?? ''}
            onChange={value => {
              onSearchChange?.(String(value))
            }}
            placeholder='Search'
          />
        </Box>
        <Box>
          {addAction}
        </Box>
      </Stack>
    </Toolbar>
  )

  return (
    <Box sx={{ height, width: '100%' }}>
      <DataGrid
        rows={rows}
        rowHeight={rowHeight}
        columns={columns}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => {
          if (isLoading) return
          onPaginationModelChange(model)
        }}
        rowCount={rowCount}
        loading={isLoading}
        pageSizeOptions={[10, 20, 30, 50]}
        disableRowSelectionOnClick
        getRowId={getRowId}
        slots={{
          toolbar: CustomToolbar,
        }}
        showToolbar
        sx={{
          border: 'none',

          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            fontWeight: 600,
          },

          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
          },

          '& .MuiDataGrid-row': {
            borderBottom: '1px solid rgba(224, 224, 227, 1)',
          },

          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
        }}
      />
    </Box>
  )
}
