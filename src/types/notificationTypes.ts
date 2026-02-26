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

export interface RealNotificationPage {
  success: boolean
  data: RealTimeNotificationData[]
  nextCursor: string | null
  hasMore: boolean
}

export interface RealNotificationInfiniteData {
  pages: RealNotificationPage[]
  pageParams: (string | null)[]
}