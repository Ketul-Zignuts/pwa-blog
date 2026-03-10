'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import BlogSplashLoader from '@/components/common/BlogSplashLoader'
import { useMutation } from '@tanstack/react-query'
import { googleLoginAction } from '@/constants/api/auth'
import { setAuthLoading, setAuthUser } from '@/store/slices/authSlice'
import { useAppDispatch } from '@/store'
import { toast } from 'react-toastify'

const GoogleCallbackPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { mutate,isPending } = useMutation({
    mutationFn: (credentials: any) => googleLoginAction(credentials),
    onMutate: () => {
      dispatch(setAuthLoading(true))
    },
    onSuccess: (userCredential: any) => {
      const token = userCredential?.token
      const user = userCredential?.user

      if (!user || !token) {
        dispatch(setAuthLoading(false))
        return
      }

      dispatch(
        setAuthUser({
          user,
          token,
          isAdminLoggedIn: false
        })
      )
      router.replace('/home')
    },
    onError: (err: any) => {
      dispatch(setAuthLoading(false))
      const message = err?.response?.data?.message || 'Login failed!'
      toast.error(message)
      router.replace('/login')
    },
    onSettled: () => {
      dispatch(setAuthLoading(false))
    }
  })

  useEffect(() => {
    if(isPending) return

    const handleCallback = async () => {
      try {
        // 🔹 Get Supabase session from URL hash automatically
        const { data, error } = await supabase.auth.getSession()
        if (error || !data?.session) {
          console.error('Supabase session error:', error)
          router.replace('/login')
          return
        }

        const session = data.session
        const user = session.user

        // 🔹 Send user info & tokens to backend API
        mutate({
          uid: user.id,
          email: user.email,
          displayName: user.user_metadata?.full_name || user.user_metadata?.displayName || user.email?.split('@')[0],
          photoURL: user.user_metadata?.avatar_url || user.user_metadata?.photoURL || '',
          provider: 'google',
          access_token: session.access_token,
          refresh_token: session.refresh_token
        })
      } catch (err) {
        console.error('Google callback handling error:', err)
        router.replace('/login')
      }
    }

    handleCallback()
  }, [router, mutate])

  return <BlogSplashLoader />
}

export default GoogleCallbackPage