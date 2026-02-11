'use client'

// MUI imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// Type imports
import type { BoxProps } from '@mui/material/Box'
import { maxHeaderSize } from 'http'

// Styled Components
const AppReactTextEditor = styled(Box)<BoxProps>(({ theme }) => ({
  padding: 2,
  minHeight: 200,
  
  '& .ProseMirror': {
    minHeight: 150,
    maxHeight:500,
    outline: 'none',
    overflowY:'auto'
  },
  
  // Image alignment
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
  
  // Links
  '& .ProseMirror a': {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
      opacity: 0.8
    }
  },
  
  // Code blocks
  '& pre': {
    background: '#0b1220',
    color: '#e5e7eb',
    padding: '16px',
    borderRadius: '12px',
    overflowX: 'auto',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '14px',
    margin: '1rem 0'
  },
  '& pre code': {
    background: 'none',
    padding: 0
  },
  
  // Table resize handles
  '& .column-resize-handle': {
    position: 'absolute',
    right: '-2px',
    top: 0,
    bottom: 0,
    width: '4px',
    cursor: 'col-resize',
    zIndex: 20,
  },
  '& .resize-cursor': {
    cursor: 'col-resize',
  },
  
  // Tables - Dark professional theme
  '& table': {
    width: '100%',
    tableLayout: 'fixed',
    borderCollapse: 'separate',
    borderSpacing: 0,
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    background: '#061E42',
    margin: '1rem 0',
  },
  '& table th': {
    background: '#45536D',
    color: '#ffffff !important',
    padding: '12px 16px !important',
    fontWeight: '600 !important',
    borderBottom: '1px solid #e2e8f0 !important',
    borderRight: '1px solid #e2e8f0 !important',
    textAlign: 'left !important',
    fontSize: '14px !important',
  },
  '& table th:last-child': {
    borderRight: 'none !important',
  },
  '& table td': {
    padding: '12px 16px !important',
    borderBottom: '1px solid #f1f5f9 !important',
    borderRight: '1px solid #f1f5f9 !important',
    background: '#061E42 !important',
    verticalAlign: 'top !important',
    color: '#e2e8f0 !important',
    fontSize: '14px !important',
  },
  '& table td:last-child': {
    borderRight: 'none !important',
  },
  '& table tr:last-child td': {
    borderBottom: 'none !important'
  },
  '& table tbody tr:nth-child(even)': {
    background: '#0f2446 !important',
  }
}))

export default AppReactTextEditor
