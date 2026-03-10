import { getRequest, patchRequest, putRequest } from '@/lib/api-request';
import { adminPostFilterParam } from '@/types/postTypes';

export const myPostListAction = (params: adminPostFilterParam) => getRequest('/general/profile/my-posts', params);
export const changeProfilePicAction = (profileImage:any) => putRequest('/general/change-profile-pic', profileImage);
export const changePassWordAction = (passWordForm:any) => putRequest('/general/change-password', passWordForm);
export const profileUpdateAction = (profileForm:any) => putRequest('/general/profile', profileForm);
export const myFollowerListAction = (params: any) => getRequest('/general/profile/my-followers', params);
export const myFollowerUnFollowAction = (patchData: any) => patchRequest('/general/profile/my-followers', patchData);