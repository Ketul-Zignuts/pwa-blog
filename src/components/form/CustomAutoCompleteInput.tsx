'use client'

import {
  Autocomplete,
  TextField,
  FormHelperText,
  Box
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
  labelPlaceHolder?:string | undefined
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
  labelPlaceHolder = undefined
}: Props) => {
  const [inputValue, setInputValue] = useState('')
  const [debouncedValue, setDebouncedValue] = useState('')

  // ✅ debounce ONLY user input
  useDebounce(
    () => {
      setDebouncedValue(inputValue)
    },
    debounceMs,
    [inputValue]
  )

  // ✅ trigger API once, safely
  useEffect(() => {
    onSearch?.(debouncedValue)
  }, [debouncedValue]) // 👈 remove onSearch from deps

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <>
          <Autocomplete
            options={options}
            getOptionLabel={(opt) => opt.label}
            value={options.find(o => o.value === field.value) || null}
            inputValue={inputValue}
            onInputChange={(_, value, reason) => {
              if (reason === 'input') {
                setInputValue(value)
              }
            }}
            onChange={(_, val) => {
              field.onChange(val?.value || '')
            }}
            filterOptions={(x) => x} // server-side filtering
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {renderOption ? renderOption(option) : option.label}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={label}
                label={labelPlaceHolder}
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
      )}
    />
  )
}

export default CustomAutocompleteInput
