'use client'

import React, { useMemo, useState } from 'react'
import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import { Controller, Control } from 'react-hook-form'

interface SelectOption {
  label: string
  value: string | number
  [key: string]: any
}

interface CustomSelectInputProps {
  name: string
  control: Control<any>
  label?: string
  options: SelectOption[]
  multiple?: boolean
  disabled?: boolean
  rules?: object
  errors?: any
  fullWidth?: boolean
  size?: 'small' | 'medium'

  // 🔍 Search
  isSearchable?: boolean
  manualSearch?: boolean
  onSearch?: (query: string) => void

  // 🎨 Custom Render
  renderOption?: (option: SelectOption) => React.ReactNode
  renderSelected?: (option: SelectOption) => React.ReactNode
}

const CustomSelectInput = ({
  name,
  control,
  label,
  options,
  multiple = false,
  disabled = false,
  rules,
  errors,
  fullWidth = true,
  size = 'medium',
  isSearchable = false,
  manualSearch = false,
  onSearch,
  renderOption,
  renderSelected
}: CustomSelectInputProps) => {
  const [search, setSearch] = useState('')

  const filteredOptions = useMemo(() => {
    if (!isSearchable || manualSearch) return options

    return options.filter(opt =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, options, isSearchable, manualSearch])

  const handleSearch = (value: string) => {
    setSearch(value)

    if (manualSearch && onSearch) {
      onSearch(value)
    }
  }

  return (
    <FormControl
      fullWidth={fullWidth}
      size={size}
      error={Boolean(errors?.[name])}
      disabled={disabled}
    >
      {label && <InputLabel>{label}</InputLabel>}

      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={multiple ? [] : ''}
        render={({ field }) => (
          <Select
            {...field}
            multiple={multiple}
            label={label}
            value={multiple ? field.value || [] : field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            renderValue={(selected) => {
              if (!multiple) {
                const option = options.find(o => o.value === selected)
                if (!option) return ''

                return renderSelected
                  ? renderSelected(option)
                  : option.label
              }

              return (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {(selected as (string | number)[]).map(val => {
                    const option = options.find(o => o.value === val)
                    if (!option) return null

                    return (
                      <Chip
                        key={val}
                        label={
                          renderSelected
                            ? renderSelected(option)
                            : option.label
                        }
                      />
                    )
                  })}
                </Box>
              )
            }}
          >
            {isSearchable && (
              <ListSubheader>
                <TextField
                  size="small"
                  placeholder="Search..."
                  fullWidth
                  autoFocus
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </ListSubheader>
            )}

            {filteredOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {renderOption ? renderOption(option) : option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />

      {errors?.[name] && (
        <FormHelperText>
          {errors[name]?.message}
        </FormHelperText>
      )}
    </FormControl>
  )
}

export default CustomSelectInput
