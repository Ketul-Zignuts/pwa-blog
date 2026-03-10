import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Type Imports
import type { Data } from '@/types/profileTypes'

// Component Imports
import UserProfile from '@/components/user-profile'

// Data Imports

const ProfileTab = dynamic(() => import('@/components/user-profile/profile/index'))
const ChangePassword = dynamic(() => import('@/components/user-profile/change-password/index'))
const MyPostList = dynamic(() => import('@/components/user-profile/my-post-list/index'))

const validTabList = ['profile','my-posts', 'change-password']

// Vars
const tabContentList = (data?: Data): { [key: string]: ReactElement } => ({
  profile: <ProfileTab />,
  'my-posts': <MyPostList />,
  'change-password': <ChangePassword />
})

const ProfilePage = async () => {

  return <UserProfile tabContentList={tabContentList()} fromUser={false} editable={true} validTabList={validTabList} />
}

export default ProfilePage
