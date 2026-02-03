'use client'

import { useState } from 'react'
import Card from '@mui/material/Card'
import TablePagination from '@mui/material/TablePagination'
import {
  flexRender,
  useReactTable,
  getCoreRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import tableStyles from '@core/styles/table.module.css'
import { Button } from '@mui/material'
import { DebouncedInput } from './DebouncedInput'
import { rankItem } from '@tanstack/match-sorter-utils'

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]

  /* 🔑 SERVER PROPS */
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
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
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

  const table = useReactTable({
    data,
    columns,

    state: { globalFilter },

    manualPagination: true,
    manualFiltering: true,

    pageCount: Math.ceil(rowCount / pageSize),

    filterFns: {
      fuzzy: fuzzyFilter
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
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
                {renderRowActions && <th>Actions</th>}
              </tr>
            ))}
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  {columns.map((_, colIndex) => (
                    <td key={`skeleton-col-${colIndex}`} className="py-4 px-6">
                      <div
                        className="h-4 bg-gray-200 rounded w-full mb-2 last:mb-0"
                        style={{
                          animationDelay: `${i * 100}ms`,
                          animationDuration: '1.2s'
                        }}
                      />
                    </td>
                  ))}
                  {renderRowActions && (
                    <td className="py-4 px-6">
                      <div className="flex gap-1">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
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
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  {renderRowActions && (
                    <td>{renderRowActions(row.original)}</td>
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
        onRowsPerPageChange={e => onPageSizeChange(Number(e.target.value))}
        rowsPerPageOptions={[10, 20, 30, 50]}
      />
    </Card>
  )
}
