'use client'

import { useEffect, useState } from 'react'
import { Box, Button, Typography, IconButton, Slide } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { usePathname } from 'next/navigation'

export default function InstallBlogButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [visible, setVisible] = useState(true)
  const pathname = usePathname()

  // ✅ Detect if running inside PWA or App WebView
  const isInStandaloneMode = () =>
    window.matchMedia('(display-mode: standalone)').matches || // PWA mode
    (navigator as any).standalone === true // iOS home screen

  const isInAppWebView = () => {
    const ua = navigator.userAgent || navigator.vendor || ''
    return /Zignuts/i.test(ua) // replace "Zignuts" with your app's identifier if needed
  }

  useEffect(() => {
    // Hide button if inside app or PWA
    if (isInStandaloneMode() || isInAppWebView()) {
      setVisible(false)
      return
    }

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // 👇 Show again when user comes to homepage (optional)
  useEffect(() => {
    if (pathname === '/' && deferredPrompt && !isInStandaloneMode() && !isInAppWebView()) {
      setVisible(true)
    }
  }, [pathname, deferredPrompt])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setVisible(false)
  }

  const handleDismiss = () => {
    setVisible(false)
  }

  if (!visible) return null

  return (
    <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 20,
          zIndex: 9999,
          background: 'rgba(0,0,0,0.9)',
          p: 2,
          borderRadius: 2,
          color: 'white',
          minWidth: 250,
          boxShadow: 4
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" sx={{color:'white'}} fontWeight={600}>
            Install Zignuts Blog
          </Typography>
          <IconButton size="small" onClick={handleDismiss} sx={{ color: 'white' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="small"
          sx={{ mt: 1 }}
          onClick={handleInstall}
        >
          📱 Install App
        </Button>
      </Box>
    </Slide>
  )
}
