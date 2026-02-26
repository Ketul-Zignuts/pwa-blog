'use client'

import { useEffect } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@supabase/supabase-js'
import { getNotificationList } from '@/constants/api/notification'
import { RealNotificationInfiniteData, RealNotificationPage, RealTimeNotificationData } from '@/types/notificationTypes'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type { 
  RealTimeNotificationData as Notification,
  RealNotificationPage as NotificationResponse, 
  RealNotificationInfiniteData 
} from '@/types/notificationTypes'

export interface NotificationResponseInfinite {
  pages: RealNotificationPage[]
  pageParams: (string | null)[]
}

export function useNotifications(uid: string) {
  const queryClient = useQueryClient()

  const query = useInfiniteQuery<
    RealNotificationPage,
    Error, 
    RealNotificationInfiniteData,
    string[]
  >({
    queryKey: ['notifications'],
    queryFn: async ({ pageParam = undefined }: { pageParam: any }) => {
      const params = new URLSearchParams()
      if (pageParam) params.append('cursor', pageParam)
      params.append('limit', '10')
    
      return await getNotificationList(params) as RealNotificationPage
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
    enabled: !!uid,
  })

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
          console.log('Raw realtime payload:', payload.new)
          
          const newNotif = payload.new as RealTimeNotificationData
          let newNotification: RealTimeNotificationData = newNotif
          
          // ✅ FETCH ACTOR DATA
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
          queryClient.setQueryData<RealNotificationInfiniteData | undefined>(
            ['notifications', uid], 
            (oldData: RealNotificationInfiniteData | undefined) => {
              if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData

              const updatedPages = oldData.pages.map((page: RealNotificationPage, index: number) =>
                index === 0
                  ? { ...page, data: [newNotification, ...page.data] }
                  : page
              )

              return { 
                ...oldData, 
                pages: updatedPages 
              }
            }
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [uid, queryClient, supabase])

  return query
}
