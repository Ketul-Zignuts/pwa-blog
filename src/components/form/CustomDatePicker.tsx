'use client'

import React from 'react'
import { Controller, Control } from 'react-hook-form'
import { Box, TextField, Typography } from '@mui/material'
import dayjs from 'dayjs'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { StyledReactDatePicker } from '@/hooks/useDatePickerStyles'

interface CustomDatePickerProps {
  name: string
  control: Control<any>
  label?: string
  placeholder?: string
  rules?: object
  errors?: any
  disabled?: boolean
  fullWidth?: boolean
  dateFormat?: string
  boxProps?: any
}

const CustomDatePicker = ({
  name,
  control,
  label,
  placeholder = 'Select date',
  rules,
  errors,
  disabled = false,
  fullWidth = true,
  dateFormat = 'yyyy-MM-dd',
  boxProps
}: CustomDatePickerProps) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { value, onChange, ref } }) => (
          <StyledReactDatePicker {...boxProps}>
            <ReactDatePicker
              selected={value ? dayjs(value).toDate() : null}
              onChange={(date: Date | null) =>
                onChange(date ? dayjs(date).format('YYYY-MM-DD') : '')
              }
              disabled={disabled}
              dateFormat={dateFormat}
              placeholderText={placeholder}
              popperPlacement="bottom-start"
              customInput={
                <TextField
                  inputRef={ref}
                  fullWidth={fullWidth}
                  label={label}
                  error={Boolean(errors?.[name])}
                  autoComplete="off"
                />
              }
            />
          </StyledReactDatePicker>
        )}
      />

      {errors?.[name] && (
        <Typography color="error" variant="body2">
          {errors[name]?.message}
        </Typography>
      )}
    </Box>
  )
}

export default CustomDatePicker