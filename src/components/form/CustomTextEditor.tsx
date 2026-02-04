'use client'

import React from 'react'
import { Controller, Control } from 'react-hook-form'
import BlogTextEditor from '@/components/common/BlogTextEditor'

interface RHFTextEditorProps {
  name: string
  control: Control<any>
  rules?: object
  errors?: any
  label?: string
  placeholder?: string
  disabled?: boolean
}

const CustomTextEditor = ({
  name,
  control,
  rules,
  errors,
  label,
  placeholder,
  disabled
}: RHFTextEditorProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <BlogTextEditor
          value={field.value || ''}
          onChange={field.onChange}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          error={errors?.[name]?.message}
        />
      )}
    />
  )
}

export default CustomTextEditor
