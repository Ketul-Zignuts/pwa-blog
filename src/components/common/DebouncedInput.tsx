// components/Input/DebouncedInput.tsx
import { useState, useEffect } from 'react'
import TextField, { TextFieldProps } from '@mui/material/TextField'

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: { value: string | number; onChange: (value: string | number) => void; debounce?: number } & Omit<TextFieldProps, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => setValue(initialValue), [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(timeout)
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}
