'use client'

import {
  Autocomplete,
  TextField,
  FormHelperText,
  Box,
  Chip
} from '@mui/material'
import { Controller, Control } from 'react-hook-form'
import { useDebounce } from 'react-use'
import { useEffect, useState } from 'react'

interface Option {
  label: string
  value: string | number
  [key: string]: any
}

interface Props {
  name: string
  control: Control<any>
  label?: string
  options: Option[]
  errors?: any
  onSearch?: (q: string) => void
  renderOption?: (option: Option) => React.ReactNode
  debounceMs?: number
  labelPlaceHolder?: string
  multiple?: boolean
}

const CustomAutocompleteInput = ({
  name,
  control,
  label,
  options,
  errors,
  onSearch,
  renderOption,
  debounceMs = 400,
  labelPlaceHolder,
  multiple = false
}: Props) => {
  const [inputValue, setInputValue] = useState('')
  const [debouncedValue, setDebouncedValue] = useState('')

  useDebounce(
    () => setDebouncedValue(inputValue),
    debounceMs,
    [inputValue]
  )

  useEffect(() => {
    onSearch?.(debouncedValue)
  }, [debouncedValue])

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selectedValue = multiple
          ? options.filter(o =>
              Array.isArray(field.value)
                ? field.value.includes(o.value)
                : false
            )
          : options.find(o => o.value === field.value) || null

        return (
          <>
            <Autocomplete
              multiple={multiple}
              options={options}
              value={selectedValue}
              inputValue={inputValue}
              getOptionLabel={(opt) => opt.label}
              isOptionEqualToValue={(opt, val) =>
                opt.value === val.value
              }
              filterOptions={(x) => x}
              clearOnEscape

              onInputChange={(_, value, reason) => {
                if (reason === 'input') {
                  setInputValue(value)
                }

                if (reason === 'clear') {
                  setInputValue('')
                  field.onChange(multiple ? [] : '')
                }
              }}

              onChange={(_, val) => {
                if (multiple) {
                  const values = (val as Option[]).map(v => v.value)
                  field.onChange(values)
                  setInputValue('')
                } else {
                  const option = val as Option | null
                  field.onChange(option?.value || '')
                  setInputValue(option?.label || '')
                }
              }}

              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {renderOption
                    ? renderOption(option)
                    : option.label}
                </Box>
              )}

              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.value}
                    label={option.label}
                    size="small"
                  />
                ))
              }

              renderInput={(params) => (
                <TextField
                  {...params}
                  label={labelPlaceHolder}
                  placeholder={label}
                  error={!!errors?.[name]}
                />
              )}
            />

            {errors?.[name] && (
              <FormHelperText error>
                {errors[name]?.message}
              </FormHelperText>
            )}
          </>
        )
      }}
    />
  )
}

export default CustomAutocompleteInput
