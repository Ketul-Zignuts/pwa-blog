export interface RealTimeNotificationData {
  id: string
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
  actor_uid?: string
  entity_id: string
  entity_type: string
  recipient_uid: string
  actor?: {
    uid: string
    photoURL: string
    displayName: string
  }
}

export interface NotificationPage {
  success: boolean
  data: RealTimeNotificationData[]
  page: number
  hasMore: boolean
  total: number
}

export interface RealNotificationInfiniteData {
  pages: NotificationPage[]
  pageParams: (string | null)[]
}