import { getRequest } from "@/lib/api-request";

export const getNotificationList = (params: any) => getRequest('/general/notifications', params);
export const getNotificationCount = (params: any) => getRequest('/general/notifications/count', params);