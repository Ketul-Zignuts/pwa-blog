'use client'

import React, { useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Control, Controller, FieldError, FieldErrorsImpl } from 'react-hook-form'
import { Typography, Button, Chip } from '@mui/material'
import CustomAvatar from '@core/components/mui/Avatar'
import { toast } from 'react-toastify'

interface FileProp {
  name: string
  type: string
  size: number
  preview?: string
}

interface CustomDropzoneProps {
  control: Control<any>
  name: string
  label?: string
  rules?: object
  errors?: FieldErrorsImpl<any>
  multiple?: boolean
  maxFiles?: number
  accept?: Record<string, string[]>
  maxSize?: number
  disabled?: boolean
  trigger?: (name: string) => Promise<boolean>
  oldImage?: string
}

const CustomDropzoneInput = ({
  control,
  name,
  label = 'Upload Files',
  rules = {},
  errors,
  multiple = false,
  maxFiles = multiple ? 5 : 1,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
  },
  maxSize = 5 * 1024 * 1024,
  disabled = false,
  trigger,
  oldImage = ''
}: CustomDropzoneProps) => {
  const error = errors?.[name] as FieldError
  const currentFilesRef = useRef<FileProp[]>([])

  // Existing image helper
  const getOldImageFile = (url?: string): FileProp | null => {
    if (!url) return null
    return {
      name: url.split('/').pop() || 'existing-image',
      size: 0,
      type: 'image/*',
      preview: url
    }
  }

  const getFileIcon = useCallback((file: FileProp) => {
    if (file.preview) {
      return (
        <img
          width={32}
          height={32}
          alt={file.name}
          src={file.preview}
          className="rounded object-cover border"
        />
      )
    }

    const previewUrl = URL.createObjectURL(file as any)
    return (
      <img
        width={32}
        height={32}
        alt={file.name}
        src={previewUrl}
        className="rounded object-cover border"
        onLoad={() => URL.revokeObjectURL(previewUrl)}
      />
    )
  }, [])

  return (
    <div className="w-full space-y-2">
      {label && (
        <Typography variant="subtitle2" className="font-medium text-sm">
          {label}
        </Typography>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value } }) => {
          const valueFiles = Array.isArray(value) ? value : value ? [value] : []

          const oldImageFile =
            !valueFiles.length && oldImage ? getOldImageFile(oldImage) : null

          const files = valueFiles.length
            ? valueFiles
            : oldImageFile
            ? [oldImageFile]
            : []

          currentFilesRef.current = files

          const hasOnlyOldImage =
            files.length === 1 && files[0].preview === oldImage

          const { getRootProps, getInputProps } = useDropzone({
            onDrop: async acceptedFiles => {
              const freshFiles = acceptedFiles.slice(0, maxFiles)

              if (multiple) {
                onChange(freshFiles)
              } else {
                onChange(freshFiles[0])
              }

              await trigger?.(name)
            },
            accept,
            maxSize,
            multiple,
            disabled,
            onDropRejected: fileRejections => {
              if (fileRejections.length > 0) {
                toast.error(
                  fileRejections[0].errors[0].message || 'File upload failed'
                )
              }
            }
          })

          return (
            <div className="space-y-2.5">
              <div {...getRootProps({ className: 'dropzone cursor-pointer' })}>
                <input {...getInputProps()} />
                <div
                  className={`flex items-center gap-1.5 py-6 ps-6 ${
                    error ? 'border border-red-500' : 'border'
                  } rounded-lg`}
                >
                  <CustomAvatar variant="rounded" size={36} skin="light" color="secondary">
                    <i className="ri-upload-2-line text-base" />
                  </CustomAvatar>
                  <div className="font-medium text-sm">
                    Drag & drop or click to replace
                  </div>
                </div>
              </div>

              {files.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                  {files.map((file, index) => {
                    const isOldImage = file.preview === oldImage

                    return (
                      <Chip
                        key={file.name || index}
                        label={
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                              {getFileIcon(file)}
                            </div>
                            <div className="truncate text-xs font-medium max-w-[140px]">
                              {file.name}
                            </div>
                          </div>
                        }
                        onDelete={
                          !disabled && !isOldImage
                            ? () => onChange(null)
                            : undefined
                        }
                        deleteIcon={
                          !isOldImage ? (
                            <i className="ri-close-line text-red-500 text-xs" />
                          ) : undefined
                        }
                        size="small"
                        variant="outlined"
                        className="!px-2 !py-0.5 min-w-0 max-w-[220px] h-12"
                      />
                    )
                  })}

                  {!hasOnlyOldImage && files.length > 1 && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => onChange(null)}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              )}
            </div>
          )
        }}
      />

      {error && (
        <Typography color="error" variant="caption">
          {error.message}
        </Typography>
      )}
    </div>
  )
}

export default CustomDropzoneInput
