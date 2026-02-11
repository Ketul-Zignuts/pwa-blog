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
import { HexColorPicker, HexColorInput } from "react-colorful";
import { TableKit } from '@tiptap/extension-table'
import AppReactTextEditor from '@/lib/styles/AppReactTextEditor'

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
  const [currentColor, setCurrentColor] = useState("#000000")
  const [previewColor, setPreviewColor] = useState("#000000")

  const saveImageTemp = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return tempFileUploadAction(formData)
    },
    onSuccess: (res) => {
      if (res.success && res.url) {
        editor?.chain().focus().setImage({ src: res.url }).run()
        setTimeout(() => {
          editor?.chain().focus().updateAttributes('image', { 'data-align': 'center' }).run()
        }, 0)
      }
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || 'failed to upload image!'
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
      TextStyle,
      FontSize,
      FontFamily,
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
      }),
      TableKit.configure({
        table: {
          resizable: true,
          handleWidth: 6,
          cellMinWidth: 80,
          lastColumnResizable: true,
          allowTableNodeSelection: true,
          renderWrapper: true,
        }
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML())
  })

  // Table helper functions
  const isTableActive = () => editor?.isActive('table')
  const isTableRowActive = () => editor?.isActive('tableRow')
  const isTableCellActive = () => editor?.isActive('tableCell') || editor?.isActive('tableHeader')
  const isTableHeaderRowActive = () => editor?.isActive('tableHeader')

  const isImageAlignActive = useCallback((align: 'left' | 'center' | 'right') => {
    const attrs = editor?.getAttributes('image')
    return attrs?.['data-align'] === align || false
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

  const setTextColor = (color: string) => {
    editor?.chain().focus().setColor(color).run()
    setCurrentColor(color)
    setColorAnchorEl(null)
  }

  const previewTextColor = (color: string) => {
    setPreviewColor(color)
  }

  const applyTextColor = () => {
    setTextColor(previewColor)
  }

  const unsetTextColor = () => {
    editor?.chain().focus().unsetColor().run()
    setCurrentColor("#000000")
    setPreviewColor("#000000")
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
  ]

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

          {/* Dynamic Image Alignment */}
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

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Lists */}
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

          {/* Style Controls */}
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

          {/* FULL TABLE CONTROLS - Microsoft Word Style */}
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          {isTableActive() ? (
            <>
              {/* Table Edit Controls */}
              <Tooltip title="Add Column Before">
                <CustomIconButton
                  variant="outlined"
                  size="small"
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                >
                  <i className="ri-arrow-left-line text-xs" />
                </CustomIconButton>
              </Tooltip>
              <Tooltip title="Add Column After">
                <CustomIconButton
                  variant="outlined"
                  size="small"
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                >
                  <i className="ri-arrow-right-line text-xs" />
                </CustomIconButton>
              </Tooltip>
              <Tooltip title="Delete Column">
                <CustomIconButton
                  color="error"
                  variant="outlined"
                  size="small"
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  disabled={!isTableCellActive()}
                >
                  <i className="ri-subtract-line" />
                </CustomIconButton>
              </Tooltip>
              <Tooltip title="Add Row Before">
                <CustomIconButton
                  variant="outlined"
                  size="small"
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                >
                  <i className="ri-arrow-up-line text-xs" />
                </CustomIconButton>
              </Tooltip>
              <Tooltip title="Add Row After">
                <CustomIconButton
                  variant="outlined"
                  size="small"
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                >
                  <i className="ri-arrow-down-line text-xs" />
                </CustomIconButton>
              </Tooltip>
              <Tooltip title="Delete Row">
                <CustomIconButton
                  color="error"
                  variant="outlined"
                  size="small"
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  disabled={!isTableRowActive()}
                >
                  <i className="ri-subtract-line" />
                </CustomIconButton>
              </Tooltip>
              <Tooltip title="Delete Table">
                <CustomIconButton
                  color="error"
                  variant="outlined"
                  size="small"
                  onClick={() => editor.chain().focus().deleteTable().run()}
                >
                  <i className="ri-delete-bin-line" />
                </CustomIconButton>
              </Tooltip>
              <Tooltip title="Merge Cells">
                <CustomIconButton
                  variant="outlined"
                  size="small"
                  onClick={() => editor.chain().focus().mergeCells().run()}
                >
                  <i className="ri-git-branch-line" />
                </CustomIconButton>
              </Tooltip>
              <Tooltip title="Split Cell">
                <CustomIconButton
                  variant="outlined"
                  size="small"
                  onClick={() => editor.chain().focus().splitCell().run()}
                >
                  <i className="ri-split-cells-horizontal" />
                </CustomIconButton>
              </Tooltip>
              <Tooltip title="Toggle Header Row">
                <CustomIconButton
                  {...(isTableHeaderRowActive() && { color: 'primary' })}
                  variant="outlined"
                  size="small"
                  onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                >
                  <i className="ri-menu-line" />
                </CustomIconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Insert Table">
              <CustomIconButton
                variant="outlined"
                size="small"
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              >
                <i className="ri-table-line" />
              </CustomIconButton>
            </Tooltip>
          )}

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Media & Code */}
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
          onClose={() => {
            setColorAnchorEl(null)
            setPreviewColor(currentColor)
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          sx={{ '.MuiPaper-root': { minWidth: 280 } }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                backgroundColor: previewColor,
                border: '2px solid',
                borderColor: 'divider',
                boxShadow: previewColor === currentColor ? '0 0 0 2px primary.main' : 'none'
              }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Preview: <code>{previewColor}</code>
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary' }}>
                Pick Color
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HexColorPicker
                  color={previewColor}
                  onChange={previewTextColor}
                />
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary' }}>
                Hex Code
              </Typography>
              <HexColorInput
                color={previewColor}
                onChange={previewTextColor}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary' }}>
                Quick Colors
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1 }}>
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
                        '&:hover': { borderColor: 'primary.main', transform: 'scale(1.05)' },
                        ...(previewColor === color && {
                          borderColor: 'primary.main',
                          boxShadow: '0 0 0 2px currentColor'
                        })
                      }}
                      onClick={() => previewTextColor(color)}
                    />
                  </Tooltip>
                ))}
              </Box>
            </Box>

            <Divider sx={{ height: 2, my: 2 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                fullWidth
                onClick={applyTextColor}
                sx={{ flex: 1 }}
              >
                Apply Color
              </Button>
              <Button
                size="small"
                variant="outlined"
                fullWidth
                onClick={unsetTextColor}
                sx={{ flex: 1 }}
              >
                Remove
              </Button>
            </Box>
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

        {/* Editor Content - UPDATED TABLE STYLES */}
        <AppReactTextEditor onClick={() => editor.chain().focus().run()}>
          <EditorContent editor={editor} />
        </AppReactTextEditor>
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
