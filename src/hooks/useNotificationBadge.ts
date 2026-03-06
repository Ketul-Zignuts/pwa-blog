'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@supabase/supabase-js'
import { useEffect } from 'react'
import { getNotificationCount } from '@/constants/api/notification'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface BadgeResponse {
  success: true
  unreadCount: number
}

export function useNotificationBadge(uid: string) {
  const queryClient = useQueryClient()

  const badgeQuery = useQuery<BadgeResponse>({
    queryKey: ['notifications-count',uid],
    queryFn: getNotificationCount,
    enabled: !!uid,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: false // prevent multiple calls on tab focus
  })

  useEffect(() => {
    if (!uid) return

    const channel = supabase
      .channel(`badge-${uid}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_uid=eq.${uid}`
        },
        () => {
          queryClient.setQueryData<BadgeResponse>(
            ['notifications-count', uid],
            (old) => ({
              success: true,
              unreadCount: (old?.unreadCount ?? 0) + 1
            })
          )
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_uid=eq.${uid}`
        },
        (payload) => {
          if (payload.new.is_read) {
            queryClient.setQueryData<BadgeResponse>(
              ['notifications-count', uid],
              (old) => ({
                success: true,
                unreadCount: Math.max(0, (old?.unreadCount ?? 0) - 1)
              })
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [uid]) // ✅ only runs when UID changes

  return {
    unreadCount: badgeQuery.data?.unreadCount ?? 0,
    isLoading: badgeQuery.isPending
  }
}
