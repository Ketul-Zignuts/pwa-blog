'use client'

import React, { useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Control, Controller, FieldError, FieldErrorsImpl } from 'react-hook-form'
import { styled } from '@mui/material/styles'
import { BoxProps } from '@mui/material/Box'
import { Typography, Button, Chip, Avatar } from '@mui/material'

// Existing Materio styled component
import AppReactDropzone from '@/lib/styles/AppReactDropzone'
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
}

const CustomDropZone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(2.5),
    borderRadius: '8px',
    border: '2px dashed #d1d5db',
    backgroundColor: '#f9fafb',
    transition: 'all 0.2s',
    '&:hover': {
      borderColor: '#3b82f6',
      backgroundColor: '#eff6ff'
    },
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(1.5)
    }
  }
}))

const CustomDropzoneInput = ({
  control,
  name,
  label = 'Upload Files',
  rules = {},
  errors,
  multiple = false,
  maxFiles = multiple ? 5 : 1,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel': ['.xls']
  },
  maxSize = 5 * 1024 * 1024,
  disabled = false,
  trigger
}: CustomDropzoneProps) => {
  const error = errors?.[name] as FieldError
  const currentFilesRef = useRef<FileProp[]>([])

  const getFileIcon = useCallback((file: FileProp) => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    const isImage = file.type?.startsWith('image/') || extension?.match(/\.(png|jpg|jpeg|webp|gif)$/i)

    if (isImage) {
      try {
        if ((file as any).arrayBuffer || (file as any).size) {
          const previewUrl = URL.createObjectURL(file as File)
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
        }
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
      } catch (e) {
        console.log('Preview generation failed:', e)
      }
    }

    if (extension === 'pdf') return <i className='ri-file-pdf-line text-red-500 text-lg' />
    if (['xlsx', 'xls'].includes(extension || '')) return <i className='ri-file-excel-2-line text-green-500 text-lg' />
    if (['doc', 'docx'].includes(extension || '')) return <i className='ri-file-word-2-line text-blue-500 text-lg' />
    if (['ppt', 'pptx'].includes(extension || '')) return <i className='ri-file-ppt-2-line text-orange-500 text-lg' />
    if (['zip', 'rar', '7z'].includes(extension || '')) return <i className='ri-file-zip-line text-purple-500 text-lg' />
    if (['txt', 'json', 'js', 'ts', 'jsx', 'tsx', 'md'].includes(extension || '')) return <i className='ri-file-text-line text-gray-500 text-lg' />
    return <i className='ri-file-line text-gray-400 text-lg' />
  }, [])

  const handleRemoveFile = useCallback((fileName: string, files: FileProp[]) => {
    return files.filter(file => file.name !== fileName)
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
          const files = Array.isArray(value) ? value : value ? [value] : []
          currentFilesRef.current = files

          const { getRootProps, getInputProps } = useDropzone({
            onDrop: async (acceptedFiles) => {
              const freshFiles = acceptedFiles.slice(0, maxFiles)
              
              if (multiple) {
                const updatedFiles = [...files, ...freshFiles].slice(0, maxFiles)
                onChange(updatedFiles)
              } else {
                onChange(freshFiles[0])
              }
              await trigger?.(name)
            },
            accept,
            maxSize,
            multiple,
            disabled,
            onDropRejected: (fileRejections) => {
              if (fileRejections.length > 0) {
                const errorMsg = fileRejections[0].errors[0].message || 'File upload failed'
                toast.error(errorMsg)
              }
            }
          })

          const handleRemoveAll = useCallback(() => {
            currentFilesRef.current.forEach(file => {
              if (file.preview && typeof file.preview === 'string') {
                URL.revokeObjectURL(file.preview)
              }
            })
            if (multiple) {
              onChange([])
            } else {
              onChange(null)
            }
          }, [multiple, onChange])

          const fileChips = files.map((file: FileProp, index: number) => (
            <Chip
              key={file.name || index}
              label={
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    {getFileIcon(file)}
                  </div>
                  <div className="min-w-0 flex-1 max-w-[140px]">
                    <div className="truncate text-xs font-medium leading-tight">{file.name}</div>
                    <div className="truncate text-xs text-gray-500 leading-tight">
                      {Math.round(file.size / 100) / 10 > 1000
                        ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} MB`
                        : `${(Math.round(file.size / 100) / 10).toFixed(1)} KB`}
                    </div>
                  </div>
                </div>
              }
              onDelete={!disabled ? () => {
                if (multiple) {
                  onChange(handleRemoveFile(file.name, files))
                } else {
                  onChange(null)
                }
              } : undefined}
              deleteIcon={<i className='ri-close-line text-red-500 text-xs' />}
              size="small"
              variant="outlined"
              className="!px-2 !py-0.5 min-w-0 max-w-[220px] h-12"
            />
          ))

          return (
            <div className="space-y-2.5">
              <div
                {...getRootProps({ className: 'dropzone cursor-pointer' })}
              >
                <input {...getInputProps()} />
                <div className={`flex items-center gap-1.5 py-6 ps-6 text-center ${error ? 'border border-red-500 rounded-lg p-2' : 'border border-white-200 rounded-lg p-2'}`} style={{ ...(error && {backgroundColor:'rgba(248, 113, 113, 0.1)'}) }}>
                  <CustomAvatar variant='rounded' size={36} skin='light' color='secondary'>
                    <i className='ri-upload-2-line text-base' />
                  </CustomAvatar>
                  <div className='font-medium text-sm'>Drag & drop or click</div>
                  {files.length > 0 && multiple && (
                    <div className='text-xs text-gray-400'>
                      {files.length}/{maxFiles} files
                    </div>
                  )}
                </div>
              </div>

              {files.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                  {fileChips}
                  {files.length > 1 && (
                    <Button
                      size='small'
                      variant='text'
                      color='error'
                      onClick={handleRemoveAll}
                      disabled={disabled}
                      className="!px-2 !py-0.5 !text-xs h-10 border border-gray-200 hover:border-gray-300"
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
        <Typography color='error' variant='caption' className='block text-xs mt-1'>
          {error.message || 'Please upload valid files'}
        </Typography>
      )}
    </div>
  )
}

CustomDropzoneInput.displayName = 'CustomDropzoneInput'
export default CustomDropzoneInput
                                                                                                                                                                                                                                                                                                                                                                                 