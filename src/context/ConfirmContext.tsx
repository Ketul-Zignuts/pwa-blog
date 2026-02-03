'use client'

import {
  createContext,
  useState,
  ReactNode,
  forwardRef
} from 'react'
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Slide
} from '@mui/material'
import type { TransitionProps } from '@mui/material/transitions'

import type {
  ConfirmOptions,
  ConfirmContextType
} from './context-types/confirm.types'

/* ================= SLIDE TRANSITION ================= */

const SlideUpTransition = forwardRef(function SlideUpTransition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

/* ================= CONTEXT ================= */

export const ConfirmContext =
  createContext<ConfirmContextType | null>(null)

/* ================= PROVIDER ================= */

export const ConfirmProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const [options, setOptions] =
    useState<ConfirmOptions>({})
  const [resolver, setResolver] =
    useState<(value: boolean) => void>()

  const confirm = (opts?: ConfirmOptions) => {
    setOptions(opts || {})
    setOpen(true)

    return new Promise<boolean>(resolve => {
      setResolver(() => resolve)
    })
  }

  const handleClose = (result: boolean) => {
    setOpen(false)
    resolver?.(result)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        fullWidth
        maxWidth="xs"
        TransitionComponent={SlideUpTransition}
        keepMounted
      >
        <DialogContent sx={{ p:5 }}>
          {/* Title */}
          <Typography
            variant="h6"
            fontWeight={500}
            sx={{ mb: 1 }}
          >
            {options.title || 'Confirm action'}
          </Typography>

          {/* Description */}
          {options.description && (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {options.description}
            </Typography>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            justifyContent: 'flex-end',
            gap: 1
          }}
        >
          <Button
            onClick={() => handleClose(false)}
            color="inherit"
          >
            {options.cancelText || 'Cancel'}
          </Button>

          <Button
            onClick={() => handleClose(true)}
            variant="contained"
          >
            {options.confirmText || 'OK'}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  )
}
