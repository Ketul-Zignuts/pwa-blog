'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { TextStyle, FontSize, FontFamily } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { Extension } from '@tiptap/core'
import { lowlight } from '@/lib/lowlight'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { Box, Typography, Divider, Dialog, DialogTitle, IconButton, DialogContent, TextField, Button, Tooltip, Popover, MenuItem, Chip } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { tempFileUploadAction } from '@/constants/api/temp-upload'
import ImageResize from 'tiptap-extension-resize-image'
import { toast } from 'react-toastify'

interface TipTapEditorFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  label?: string
  error?: string
}

const TabIndent = Extension.create({
  name: 'tabIndent',
  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.insertContent('    ')
    }
  }
})

const ImageWithAlignment = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-align': {
        default: 'center',
        parseHTML: element => element.getAttribute('data-align'),
        renderHTML: attributes => {
          if (!attributes['data-align']) return {}
          return { 'data-align': attributes['data-align'] }
        }
      }
    }
  }
})

const BlogTextEditor = ({
  value,
  onChange,
  placeholder = 'Write something here...',
  disabled = false,
  label,
  error
}: TipTapEditorFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [colorAnchorEl, setColorAnchorEl] = useState<HTMLElement | null>(null)
  const [sizeAnchorEl, setSizeAnchorEl] = useState<HTMLElement | null>(null)
  const [fontAnchorEl, setFontAnchorEl] = useState<HTMLElement | null>(null)

  const saveImageTemp = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return tempFileUploadAction(formData)
    },
    onSuccess: (res) => {
      console.log('res: ', res);
      if (res.success && res.url) {
        editor?.chain().focus().setImage({ src: res.url }).run()
        setTimeout(() => {
          editor?.chain().focus().updateAttributes('image', { 'data-align': 'center' }).run()
        }, 0)
      }
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || 'failed to upload image!';
      toast.error(message)
    },
  })

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: 'plaintext' }),
      TabIndent,
      Underline,
      TextStyle,        // Required base mark
      FontSize,         // Font size functionality
      FontFamily,       // Font family functionality
      Color.configure({ types: ['textStyle'] }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-primary underline hover:no-underline cursor-pointer',
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      }),
      ImageWithAlignment.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto my-4 rounded-lg shadow-md max-h-96'
        },
      }),
      ImageResize.configure({
        inline: false,
      })
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML())
  })

  const isImageAlignActive = useCallback((align: 'left' | 'center' | 'right') => {
    const attrs = editor?.getAttributes('image')
    console.log('Image attrs:', attrs)
    return attrs?.['data-align'] === align || false  // Added return!
  }, [editor])

  const setImageAlign = useCallback((align: 'left' | 'center' | 'right') => {
    if (!editor?.isActive('image')) return false
    editor.chain().focus().updateAttributes('image', { 'data-align': align }).run()
    return true
  }, [editor])

  const canSetImageAlign = useCallback(() => {
    return editor?.isActive('image') || false
  }, [editor])

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [value, editor])

  // ✅ FIXED: Correct v3 commands
  const setTextColor = (color: string) => {
    editor?.chain().focus().setColor(color).run()
    setColorAnchorEl(null)
  }

  const unsetTextColor = () => {
    editor?.chain().focus().unsetColor().run()
    setColorAnchorEl(null)
  }

  const setFontSize = (size: string) => {
    editor?.chain().focus().setFontSize(size).run()
    setSizeAnchorEl(null)
  }

  const unsetFontSize = () => {
    editor?.chain().focus().unsetFontSize().run()
    setSizeAnchorEl(null)
  }

  const setFontFamily = (family: string) => {
    editor?.chain().focus().setFontFamily(family).run()
    setFontAnchorEl(null)
  }

  const unsetFontFamily = () => {
    editor?.chain().focus().unsetFontFamily().run()
    setFontAnchorEl(null)
  }


  const isTextColorActive = () => !!editor?.getAttributes('textStyle')?.color
  const getCurrentFontSize = () => editor?.getAttributes('textStyle')?.fontSize || ''
  const getCurrentFontFamily = () => editor?.getAttributes('textStyle')?.fontFamily || ''
  const isFontSizeActive = () => !!getCurrentFontSize()
  const isFontFamilyActive = () => !!getCurrentFontFamily()

  const colorPresets = [
    '#000000', '#e60000', '#ff8c00', '#ffd700', '#008000',
    '#0066cc', '#8b00ff', '#ee82ee', '#808080', '#ffffff'
  ]

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px', '36px', '48px']
  const fontFamilies = [
    'Inter, system-ui, sans-serif',
    'Roboto, "Helvetica Neue", Arial, sans-serif',
    'Georgia, "Times New Roman", Times, serif',
    'Verdana, Geneva, Tahoma, sans-serif',
    'Tahoma, Geneva, sans-serif',
    'Trebuchet MS, Helvetica, sans-serif',
    'Arial, Helvetica, sans-serif',
    '"Segoe UI", Tahoma, Geneva, sans-serif',
    'Courier New, Courier, monospace',
    '"Lucida Console", Monaco, monospace',
    'Palatino Linotype, "Book Antiqua", Palatino, serif',
    '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
    '"Gill Sans", "Gill Sans MT", Calibri, sans-serif',
    'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
    '"Comic Sans MS", cursive, sans-serif'
  ];

  const handleImageClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    saveImageTemp.mutate(file)
    e.target.value = ''
  }

  const getSelectedText = () => {
    if (!editor) return ''
    const { from, to } = editor.state.selection
    return editor.state.doc.textBetween(from, to)
  }

  const insertLink = () => {
    if (!editor || !linkUrl.trim()) return

    const selectedText = getSelectedText()
    const textToUse = selectedText || linkText

    if (textToUse.trim()) {
      editor.chain()
        .focus()
        .deleteSelection()
        .insertContent({
          type: 'text',
          text: textToUse,
          marks: [{
            type: 'link',
            attrs: {
              href: linkUrl.trim(),
              target: '_blank',
              rel: 'noopener noreferrer'
            }
          }]
        })
        .run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({
        href: linkUrl.trim(),
        target: '_blank',
        rel: 'noopener noreferrer'
      }).run()
    }

    setLinkDialogOpen(false)
    setLinkUrl('')
    setLinkText('')
  }

  const handleLinkDialogOpen = () => {
    setLinkText(getSelectedText())
    setLinkDialogOpen(true)
  }

  if (!editor) return <Box />

  return (
    <Box>
      {label && <Typography variant="body2" sx={{ mb: 1 }}>{label}</Typography>}

      <Box sx={{
        border: '1px solid',
        borderColor: error ? 'error.main' : 'divider',
        borderRadius: 1.5,
        overflow: 'hidden',
        '&:focus-within': { borderColor: error ? 'error.main' : 'primary.main' }
      }}>
        {/* Toolbar */}
        <Box className="flex flex-wrap gap-x-2 gap-y-1 p-3">
          {/* Basic Formatting */}
          <Tooltip title="Bold">
            <CustomIconButton
              {...(editor.isActive('bold') && { color: 'primary' })}
              variant="outlined"
              size="small"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <i className="ri-bold" />
            </CustomIconButton>
          </Tooltip>

          <Tooltip title="Italic">
            <CustomIconButton
              {...(editor.isActive('italic') && { color: 'primary' })}
              variant="outlined"
              size="small"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <i className="ri-italic" />
            </CustomIconButton>
          </Tooltip>

          <Tooltip title="Underline">
            <CustomIconButton
              {...(editor.isActive('underline') && { color: 'primary' })}
              variant="outlined"
              size="small"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <i className="ri-underline" />
            </CustomIconButton>
          </Tooltip>

          <Tooltip title="Strikethrough">
            <CustomIconButton
              {...(editor.isActive('strike') && { color: 'primary' })}
              variant="outlined"
              size="small"
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <i className="ri-strikethrough" />
            </CustomIconButton>
          </Tooltip>

          {canSetImageAlign() && (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              <Tooltip title="Align Left">
                <CustomIconButton
                  {...(isImageAlignActive('left') && { color: 'primary' })}
                  variant="outlined" size="small"
                  onClick={() => setImageAlign('left')}
                >
                  <i className="ri-align-left" />
                </CustomIconButton>
              </Tooltip>

              <Tooltip title="Align Center">
                <CustomIconButton
                  {...(isImageAlignActive('center') && { color: 'primary' })}
                  variant="outlined" size="small"
                  onClick={() => setImageAlign('center')}
                >
                  <i className="ri-align-center" />
                </CustomIconButton>
              </Tooltip>

              <Tooltip title="Align Right">
                <CustomIconButton
                  {...(isImageAlignActive('right') && { color: 'primary' })}
                  variant="outlined" size="small"
                  onClick={() => setImageAlign('right')}
                >
                  <i className="ri-align-right" />
                </CustomIconButton>
              </Tooltip>
            </>
          )}

          <Tooltip title="Bullet List">
            <CustomIconButton
              className={editor.isActive('bulletList') ? 'bg-primary/10' : ''}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <i className="ri-list-unordered" />
            </CustomIconButton>
          </Tooltip>

          <Tooltip title="Numbered List">
            <CustomIconButton
              className={editor.isActive('orderedList') ? 'bg-primary/10' : ''}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <i className="ri-list-ordered" />
            </CustomIconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Style Controls - ✅ FULLY FIXED */}
          <Tooltip title="Text Color">
            <CustomIconButton
              {...(isTextColorActive() && { color: 'primary' })}
              variant="outlined"
              size="small"
              onClick={(e) => setColorAnchorEl(e.currentTarget)}
            >
              <i className="ri-palette-line" />
            </CustomIconButton>
          </Tooltip>

          <Tooltip title="Font Size">
            <CustomIconButton
              {...(isFontSizeActive() && { color: 'primary' })}
              variant="outlined"
              size="small"
              onClick={(e) => setSizeAnchorEl(e.currentTarget)}
            >
              <i className="ri-font-size-2 text-[22px]"></i>
            </CustomIconButton>
          </Tooltip>

          <Tooltip title="Font Family">
            <CustomIconButton
              {...(isFontFamilyActive() && { color: 'primary' })}
              variant="outlined"
              size="small"
              onClick={(e) => setFontAnchorEl(e.currentTarget)}
            >
              <i className="ri-font-family" />
            </CustomIconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <Tooltip title="Code Block">
            <CustomIconButton
              {...(editor.isActive('codeBlock') && { color: 'primary' })}
              variant="outlined"
              size="small"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <i className="ri-code-box-line" />
            </CustomIconButton>
          </Tooltip>

          <Tooltip title="Link">
            <CustomIconButton
              {...(editor.isActive('link') && { color: 'primary' })}
              variant="outlined"
              size="small"
              onClick={handleLinkDialogOpen}
            >
              <i className="ri-link" />
            </CustomIconButton>
          </Tooltip>

          <Tooltip title="Image">
            <CustomIconButton
              variant="outlined"
              size="small"
              onClick={handleImageClick}
            >
              <i className="ri-image-line" />
            </CustomIconButton>
          </Tooltip>
        </Box>

        <Divider />

        {/* Color Picker */}
        <Popover
          open={Boolean(colorAnchorEl)}
          anchorEl={colorAnchorEl}
          onClose={() => setColorAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <Box sx={{ p: 1, minWidth: 200 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, p: 1 }}>
              {colorPresets.map(color => (
                <Tooltip key={color} title={color}>
                  <Chip
                    size="small"
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: '2px solid transparent',
                      cursor: 'pointer',
                      '&:hover': { borderColor: 'primary.main' },
                      ...(editor?.isActive('textStyle', { color }) && {
                        borderColor: 'primary.main',
                        transform: 'scale(1.1)'
                      })
                    }}
                    onClick={() => setTextColor(color)}
                  />
                </Tooltip>
              ))}
            </Box>
            <Button size="small" fullWidth onClick={unsetTextColor} sx={{ mt: 1 }}>
              Remove Color
            </Button>
          </Box>
        </Popover>

        {/* Font Size Picker */}
        <Popover
          open={Boolean(sizeAnchorEl)}
          anchorEl={sizeAnchorEl}
          onClose={() => setSizeAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <Box sx={{ p: 2, minWidth: 120 }}>
            {fontSizes.map(size => (
              <MenuItem
                key={size}
                onClick={() => setFontSize(size)}
                selected={getCurrentFontSize() === size}
              >
                {size}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={unsetFontSize}>Default</MenuItem>
          </Box>
        </Popover>

        {/* Font Family Picker */}
        <Popover
          open={Boolean(fontAnchorEl)}
          anchorEl={fontAnchorEl}
          onClose={() => setFontAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <Box sx={{ p: 2, minWidth: 200 }}>
            {fontFamilies.map(family => (
              <MenuItem
                key={family}
                onClick={() => setFontFamily(family)}
                sx={{ fontFamily: family.includes(',') ? family.split(',')[0].replace(/"/g, '') : family }}
                selected={getCurrentFontFamily() === family}
              >
                {family.split(',')[0].replace(/"/g, '')}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={unsetFontFamily}>Default</MenuItem>
          </Box>
        </Popover>

        {/* Link Dialog */}
        <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)} maxWidth="sm">
          <DialogTitle>
            Insert Link
            <IconButton onClick={() => setLinkDialogOpen(false)} sx={{ position: 'absolute', right: 16, top: 16 }}>
              <i className="ri-close-line" />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Link text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              helperText="Leave empty to use selected text"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={insertLink}
              disabled={!linkUrl.trim()}
            >
              Insert Link
            </Button>
          </DialogContent>
        </Dialog>

        {/* Editor Content */}
        <Box
          sx={{
            p: 2,
            minHeight: 200,
            '& .ProseMirror': {
              minHeight: 150,
              outline: 'none'
            },
            '& img[data-align="left"]': {
              float: 'left !important',
              margin: '0 1rem 1rem 0 !important',
              clear: 'left',
              maxWidth: '50%'
            },
            '& img[data-align="center"]': {
              display: 'block !important',
              margin: '0 auto 1rem auto !important',
              clear: 'both'
            },
            '& img[data-align="right"]': {
              float: 'right !important',
              margin: '0 0 1rem 1rem !important',
              clear: 'right',
              maxWidth: '50%'
            },
            '& .ProseMirror a': {
              color: 'primary.main',
              textDecoration: 'underline',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
                opacity: 0.8
              }
            },
            '& pre': {
              background: '#0b1220',
              color: '#e5e7eb',
              padding: '16px',
              borderRadius: '12px',
              overflowX: 'auto',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '14px'
            },
            '& pre code': {
              background: 'none',
              padding: 0
            }
          }}
          onClick={() => editor.chain().focus().run()}
        >
          <EditorContent editor={editor} />
        </Box>
      </Box>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </Box>
  )
}

export default BlogTextEditor
