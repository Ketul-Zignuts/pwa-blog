import React from 'react'

//* MUI Imports
import { TextField, Typography, keyframes, InputAdornment } from '@mui/material'
import IconButton from '@mui/material/IconButton'

//* NPM Imports
import { Control, Controller } from 'react-hook-form'
import { Box } from '@mui/system'

interface FormInputProps {
  id: string
  name: string
  placeholder: string
  label?: string
  register?: any
  control?: Control | any
  errors: any
  styles?: React.CSSProperties | any
  rules?: object
  disabled?: boolean
  multiline?: boolean
  type?: string
  extraProps?: any
  customMsg?: string
  rows?: number
  onChangeCallback?: (e: any) => void
  onBlurCallback?: (e: any) => void
  fullWidth?: boolean
  variant?: 'standard' | 'outlined' | 'filled'
  size?: 'small' | 'medium'
  onKeyDown?: (e: any) => void
  requiredFlag?: boolean
  inputProps?: any
  // NEW ICON PROPS
  icon?: React.ReactNode
  onIconPress?: () => void
  iconPosition?: 'start' | 'end'
  shrinkLabel?:boolean
}

const glowAnimation = keyframes`
  0% {
    border-color: #ff4444;
    box-shadow: 0 0 5px rgba(255, 68, 68, 0.3);
  }
  50% {
    border-color: #ff6666;
    box-shadow: 0 0 15px rgba(255, 68, 68, 0.6);
  }
  100% {
    border-color: #ff4444;
    box-shadow: 0 0 5px rgba(255, 68, 68, 0.3);
  }
`

function CustomTextInput({
  control,
  rules,
  errors,
  name,
  type = 'text',
  placeholder,
  label,
  styles,
  id,
  disabled = false,
  multiline = false,
  extraProps = {},
  customMsg,
  rows = 1,
  onChangeCallback,
  onBlurCallback,
  fullWidth = true,
  variant = 'outlined',
  size,
  onKeyDown,
  requiredFlag = false,
  inputProps,
  icon,
  onIconPress,
  shrinkLabel = false
}: FormInputProps) {
  const isRequired = requiredFlag || false

  return (
    <Box sx={{ width: '100%' }}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value, ref } }) => (
          <>
            <TextField
              fullWidth={fullWidth}
              id={id}
              inputRef={ref}
              type={type}
              variant={variant}
              disabled={disabled}
              size={size}
              multiline={multiline}
              placeholder={placeholder}
              label={label ?? undefined}
              autoComplete='off'
              error={Boolean(errors?.[name])}
              value={value ?? ''}
              inputProps={inputProps}
              InputLabelProps={{
                shrink: shrinkLabel ?? false
              }}
              onChange={val => {
                const inputValue = val.target.value
                if (type === 'number' && parseFloat(inputValue) >= 0) {
                  onChange(inputValue)
                  onChangeCallback && onChangeCallback(inputValue)
                } else {
                  onChange(inputValue)
                  onChangeCallback && onChangeCallback(inputValue)
                }
              }}
              onBlur={val => {
                onBlurCallback && onBlurCallback(val.target.value || null)
              }}
              onKeyDown={onKeyDown}
              sx={{
                ...styles,
                borderRadius: '8px',
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                  display: 'none'
                },
                '& input[type=number]': {
                  MozAppearance: 'textfield'
                },
                '& fieldset': {
                  ...(isRequired &&
                    !errors?.[name] && {
                    border: '2px solid #ff4444 !important',
                    animation: `${glowAnimation} 2s ease-in-out infinite`
                  })
                },
                '&:focus-within fieldset':
                  isRequired && !errors?.[name]
                    ? {
                      border: '2px solid #ff6666 !important',
                      boxShadow: '0 0 10px rgba(255, 68, 68, 0.5)'
                    }
                    : {}
              }}
              InputProps={{
                ...extraProps,
                endAdornment: icon ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => onIconPress && onIconPress()}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      size="small"
                      disabled={disabled}
                    >
                      {icon}
                    </IconButton>
                  </InputAdornment>
                ) : undefined
              }}
              rows={rows}
            />
          </>
        )}
      />
      {customMsg || errors?.[name] ? (
        <Typography color='error' variant='body2' sx={{ wordWrap: 'break-word' }}>
          {customMsg || (errors?.[name]?.message as string)}
        </Typography>
      ) : null}
    </Box>
  )
}

export default CustomTextInput
