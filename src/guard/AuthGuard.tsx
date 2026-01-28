// guard/AuthGuard.tsx
'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import type { ReactNode } from 'react'

interface AuthGuardProps {
  children: ReactNode
  pageType: 'user' | 'admin'
}

const AuthGuard = ({ children, pageType }: AuthGuardProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (loading) return

    const loginPath = pageType === 'admin' ? '/admin/login' : '/login'
    const homePath = pageType === 'admin' ? '/admin/home' : '/home'

    // NOT LOGGED IN
    if (!user) {
      if (pathname === loginPath) return
      router.replace(loginPath)
      return
    }

    // LOGGED IN - Skip login pages
    if (user && pathname === loginPath) {
      router.replace(homePath)
      return
    }

    // Base paths
    if (user && pathname === '/' && pageType === 'user') {
      router.replace('/home')
    }
    if (user && pathname === '/admin' && pageType === 'admin') {
      router.replace('/admin/home')
    }
  }, [user, loading, pathname, router, pageType])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return <>{children}</>
}

export default AuthGuard
