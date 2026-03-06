import { adminSupabase } from '@/lib/supabase-server'
import { pushMessaging } from '@/lib/firebase-admin'

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
    // Don't notify self
    if (recipientUid === actorUid) return

    // 1️⃣ Create notification in DB via RPC
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

    // 2️⃣ Get all active device tokens for this user
    const { data: devices } = await adminSupabase
      .from('user_devices')
      .select('fcm_token')
      .eq('uid', recipientUid)

      console.log('devices: ', devices);
    if (!devices?.length) return

    // 3️⃣ Send notifications in parallel
    const sendResults = await Promise.allSettled(
      devices.map(device =>
        pushMessaging.send({
          token: device.fcm_token,
          notification: { title, body: message },
          data: { type, entityId: entityId ?? '' },
        }).catch(async err => {
          // Remove invalid tokens automatically
          if ((err as any)?.code === 'messaging/registration-token-not-registered') {
            console.log('Removing invalid token:', device.fcm_token)
            await adminSupabase
              .from('user_devices')
              .delete()
              .eq('fcm_token', device.fcm_token)
          } else {
            console.error('FCM send error:', err)
          }
          return null
        })
      )
    )

    // Optional: log successful sends
    sendResults.forEach((res, i) => {
      if (res.status === 'fulfilled' && res.value) {
        console.log('Push sent to token:', devices[i].fcm_token)
      }
    })
  } catch (err) {
    console.error('Notification service RPC error:', err)
  }
}