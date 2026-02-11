import { db as profileData } from '@/fake-db/pages/userProfile'
import { getRequest } from '@/lib/api-request';
import { adminPostFilterParam } from '@/types/postTypes';


export const getProfileData = async () => {
  return profileData
}

export const myPostListAction = (params: adminPostFilterParam) => getRequest('/general/profile/my-posts', params);