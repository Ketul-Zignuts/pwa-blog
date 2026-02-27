import { useEffect } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@supabase/supabase-js'
import { RealTimeNotificationData } from '@/types/notificationTypes'
import { getNotificationList } from '@/constants/api/notification'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface NotificationPage {
  success: boolean
  data: RealTimeNotificationData[]
  page: number       // next page number
  hasMore: boolean
  total: number
}

export interface NotificationInfiniteData {
  pages: NotificationPage[]
  pageParams: (number | null)[]
}

export function useNotifications(uid: string) {
  const queryClient = useQueryClient()

const query = useInfiniteQuery<NotificationPage, Error>({
  queryKey: ['notifications', uid],
  queryFn: async ({ pageParam = 1 }) => getNotificationList({page: pageParam}),
  getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page : undefined,
  initialPageParam: 1,
  enabled: !!uid,
})

  // Supabase realtime updates
  useEffect(() => {
    if (!uid) return

    const channel = supabase
      .channel(`notifications-${uid}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_uid=eq.${uid}`,
        },
        async (payload: any) => {
          const newNotif = payload.new as RealTimeNotificationData
          let newNotification = newNotif

          if (newNotif.actor_uid) {
            const { data: actorData } = await supabase
              .from('users')
              .select('uid, displayName, photoURL')
              .eq('uid', newNotif.actor_uid)
              .single()

            newNotification = {
              ...newNotif,
              actor: actorData || undefined
            }
          }

          queryClient.setQueryData<NotificationInfiniteData>(['notifications', uid], (oldData) => {
            if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData

            const updatedPages = oldData.pages.map((page, index) =>
              index === 0
                ? { ...page, data: [newNotification, ...page.data] }
                : page
            )

            return {
              ...oldData,
              pages: updatedPages
            }
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [uid, queryClient])

  return query
}