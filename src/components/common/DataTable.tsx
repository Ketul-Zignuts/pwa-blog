'use client'

import { useState } from 'react'
import Card from '@mui/material/Card'
import TablePagination from '@mui/material/TablePagination'
import {
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import type {
  ColumnDef,
  FilterFn,
  ColumnSizingState
} from '@tanstack/react-table'
import tableStyles from '@core/styles/table.module.css'
import { DebouncedInput } from './DebouncedInput'
import { rankItem } from '@tanstack/match-sorter-utils'

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]

  page: number
  pageSize: number
  rowCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void

  onGlobalFilterChange?: (value: string) => void
  renderRowActions?: (row: T) => React.ReactNode
  renderAddAction?: () => React.ReactNode
  isLoading?: boolean
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

export function DataTable<T>({
  columns,
  data,
  page,
  pageSize,
  rowCount,
  onPageChange,
  onPageSizeChange,
  onGlobalFilterChange,
  renderRowActions,
  renderAddAction,
  isLoading
}: DataTableProps<T>) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})

  const table = useReactTable({
    data,
    columns,

    state: {
      globalFilter,
      columnSizing
    },

    onColumnSizingChange: setColumnSizing,

    manualPagination: true,
    manualFiltering: true,

    pageCount: Math.ceil(rowCount / pageSize),

    filterFns: {
      fuzzy: fuzzyFilter
    },

    columnResizeMode: 'onChange',

    defaultColumn: {
      size: 200,
      minSize: 80,
      maxSize: 600
    },

    onGlobalFilterChange: value => {
      const v = String(value)
      setGlobalFilter(v)
      onGlobalFilterChange?.(v)
    },

    getCoreRowModel: getCoreRowModel()
  })

  return (
    <Card>
      {/* Header */}
      <div className='flex items-start justify-between max-sm:flex-col sm:items-center gap-y-4 p-5'>
        <DebouncedInput
          value={globalFilter}
          onChange={value => {
            const v = String(value)
            setGlobalFilter(v)
            onGlobalFilterChange?.(v)
          }}
          placeholder='Search'
        />

        {renderAddAction && renderAddAction()}
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table
          className={tableStyles.table}
          style={{
            width: table.getTotalSize(),
            tableLayout: 'fixed' // 🔥 REQUIRED
          }}
        >
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      position: 'relative'
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    {/* Resize Handle */}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          height: '100%',
                          width: '6px',
                          cursor: 'col-resize',
                          userSelect: 'none',
                          touchAction: 'none'
                        }}
                      />
                    )}
                  </th>
                ))}

                {renderRowActions && (
                  <th
                    style={{
                      width: 120
                    }}
                  >
                    Actions
                  </th>
                )}
              </tr>
            ))}
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={`skeleton-${i}`} className='animate-pulse'>
                  {columns.map((_, colIndex) => (
                    <td
                      key={`skeleton-col-${colIndex}`}
                      style={{ width: 200 }}
                      className='py-4 px-6'
                    >
                      <div className='h-4 bg-gray-200 rounded w-full' />
                    </td>
                  ))}
                  {renderRowActions && (
                    <td style={{ width: 120 }}>
                      <div className='flex gap-1'>
                        <div className='w-8 h-8 bg-gray-200 rounded-full' />
                        <div className='w-8 h-8 bg-gray-200 rounded-full' />
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (renderRowActions ? 1 : 0)}
                  className='text-center p-4'
                >
                  No data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      style={{
                        width: cell.column.getSize()
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                  {renderRowActions && (
                    <td style={{ width: 120 }}>
                      {renderRowActions(row.original)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <TablePagination
        component='div'
        count={rowCount}
        page={page}
        rowsPerPage={pageSize}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={e =>
          onPageSizeChange(Number(e.target.value))
        }
        rowsPerPageOptions={[10, 20, 30, 50]}
      />
    </Card>
  )
}