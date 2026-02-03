import React from 'react'

// MUI Imports
import {
  Switch,
  FormControlLabel,
  Typography,
  Box
} from '@mui/material'

// RHF Imports
import { Controller, Control } from 'react-hook-form'

/* ================= TYPES ================= */

interface CustomSwitchProps {
  name: string
  control: Control<any>
  label: string
  errors: any
  disabled?: boolean
  rules?: object
  requiredFlag?: boolean
  onChangeCallback?: (value: boolean) => void
}

/* ================= COMPONENT ================= */

const CustomSwitch = ({
  name,
  control,
  label,
  errors,
  disabled = false,
  rules,
  requiredFlag = false,
  onChangeCallback
}: CustomSwitchProps) => {
  const hasError = Boolean(errors?.[name])

  return (
    <Box sx={{ width: '100%' }}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { value, onChange } }) => (
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(value)}
                disabled={disabled}
                onChange={(_, checked) => {
                  onChange(checked)
                  onChangeCallback?.(checked)
                }}
                color={hasError ? 'error' : 'primary'}
              />
            }
            label={label}
          />
        )}
      />

      {/* Error Message */}
      {hasError && (
        <Typography color="error" variant="body2">
          {errors?.[name]?.message}
        </Typography>
      )}
    </Box>
  )
}

export default CustomSwitch
