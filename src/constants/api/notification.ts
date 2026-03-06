import { getRequest, patchRequest, postRequest } from "@/lib/api-request";

export const getNotificationList = (params: any) => getRequest('/general/notifications', params);
export const getNotificationCount = () => getRequest('/public/notifications/count');
export const patchNotification = (notificationData: any) => patchRequest('/general/notifications', notificationData);
export const storeFcmToken = (notificationData: any) => postRequest('/public/notifications/store-token', notificationData);