'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppSelector, RootState } from '@/store'
import BlogSplashLoader from '@/components/common/BlogSplashLoader'

interface AuthGuardProps {
  children: ReactNode
  pageType: 'user' | 'admin'
}

const AuthGuard = ({ children, pageType }: AuthGuardProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const { user, authUserLoading, isAdminLoggedIn } = useAppSelector((state: RootState) => state.auth)

  const [isAllowed, setIsAllowed] = useState(false)

  const publicPath = [
    '/login',
    '/register',
    '/admin/login'
  ]

  useEffect(() => {
    if (authUserLoading) return

    const loginPath = pageType === 'admin' ? '/admin/login' : '/login'
    const homePath = pageType === 'admin' ? '/admin/home' : '/'

    const isPublicRoute = publicPath.some(path =>
      pathname.startsWith(path)
    )

    if (!user) {
      if (isPublicRoute) {
        setIsAllowed(true)
        return
      }

      router.replace(loginPath)
      setIsAllowed(false)
      return
    }

    if (isPublicRoute) {
      router.replace(homePath)
      setIsAllowed(false)
      return
    }

    if (pathname === '/' && pageType === 'user') {
      router.replace('/home')
      setIsAllowed(false)
      return
    }

    if (pathname === '/admin' && pageType === 'admin') {
      router.replace('/admin/home')
      setIsAllowed(false)
      return
    }

    if (pageType === 'admin' && !isAdminLoggedIn) {
      router.replace('/404')
      setIsAllowed(false)
      return
    }

    if (pageType === 'user' && isAdminLoggedIn) {
      router.replace('/404')
      setIsAllowed(false)
      return
    }

    setIsAllowed(true)
  }, [
    user,
    authUserLoading,
    isAdminLoggedIn,
    pathname,
    router,
    pageType
  ])

  if (!isAllowed) {
    return <BlogSplashLoader />
  }

  return <>{children}</>
}

export default AuthGuard
