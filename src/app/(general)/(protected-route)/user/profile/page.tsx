import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Type Imports
import type { Data } from '@/types/profileTypes'

// Component Imports
import UserProfile from '@/components/user-profile'
import { Container } from '@mui/material'
import HomeNavbar from '@/components/navbar/HomeNavbar'

// Data Imports

const ProfileTab = dynamic(() => import('@/components/user-profile/profile/index'))
const ChangePassword = dynamic(() => import('@/components/user-profile/change-password/index'))
const MyPostList = dynamic(() => import('@/components/user-profile/my-post-list/index'))

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  profile: <ProfileTab />,
  'my-posts': <MyPostList />,
  'change-password': <ChangePassword />
})

const ProfilePage = async () => {

  return (
    <>
      <HomeNavbar />
      <Container maxWidth='lg'>
        <UserProfile tabContentList={tabContentList()} fromUser={true} editable={true} />
      </Container>
    </>
  )
}

export default ProfilePage