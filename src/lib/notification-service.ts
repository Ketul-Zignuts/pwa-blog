import { adminSupabase } from '@/lib/supabase-server'

export type NotificationType =
  | 'follow'
  | 'comment'
  | 'like'
  | 'review'
  | 'post_published'

interface CreateNotificationParams {
  recipientUid: string
  actorUid: string
  type: NotificationType
  entityId?: string
  entityType?: string
  title: string
  message: string
}

export async function createNotification({
  recipientUid,
  actorUid,
  type,
  entityId,
  entityType,
  title,
  message,
}: CreateNotificationParams) {
  try {
    if (recipientUid === actorUid) return // Prevent self notifications

    const { error } = await adminSupabase.rpc('create_notification', {
      p_recipient_uid: recipientUid,
      p_actor_uid: actorUid,
      p_type: type,
      p_entity_id: entityId ?? null,
      p_entity_type: entityType ?? null,
      p_title: title,
      p_message: message,
    })

    if (error) console.error('RPC create_notification error:', error)
  } catch (err) {
    console.error('Notification service RPC error:', err)
  }
}