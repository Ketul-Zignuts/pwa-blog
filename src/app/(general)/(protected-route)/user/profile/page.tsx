import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import UserProfile from '@/components/user-profile'
import { Container } from '@mui/material'
import HomeNavbar from '@/components/navbar/HomeNavbar'

// Data Imports

const ProfileTab = dynamic(() => import('@/components/user-profile/profile/index'))
const ChangePassword = dynamic(() => import('@/components/user-profile/change-password/index'))
const MyPostList = dynamic(() => import('@/components/user-profile/my-post-list/index'))
const MyFollower = dynamic(() => import('@/components/user-profile/my-follower-list/index'))

// Vars
const validTabList = ['profile','my-posts','change-password','my-follower'];

const tabContentList = (): { [key: string]: ReactElement } => ({
  profile: <ProfileTab />,
  'my-posts': <MyPostList />,
  'change-password': <ChangePassword />,
  'my-follower': <MyFollower />
})

const ProfilePage = async () => {

  return (
    <>
      <HomeNavbar />
      <Container maxWidth='lg' sx={{my:10}}>
        <UserProfile tabContentList={tabContentList()} fromUser={true} editable={true} validTabList={validTabList} />
      </Container>
    </>
  )
}

export default ProfilePage