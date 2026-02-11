import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Type Imports
import type { Data } from '@/types/profileTypes'

// Component Imports
import UserProfile from '@/components/user-profile'
import { getProfileData } from '@/constants/api/profile'

// Data Imports

const ProfileTab = dynamic(() => import('@/components/user-profile/profile/index'))
const TeamsTab = dynamic(() => import('@/components/user-profile/teams/index'))
const ProjectsTab = dynamic(() => import('@/components/user-profile/projects/index'))
const ConnectionsTab = dynamic(() => import('@/components/user-profile/connections/index'))

// Vars
const tabContentList = (data?: Data): { [key: string]: ReactElement } => ({
  profile: <ProfileTab data={data?.users.profile} />,
  teams: <TeamsTab data={data?.users.teams} />,
  projects: <ProjectsTab data={data?.users.projects} />,
  connections: <ConnectionsTab data={data?.users.connections} />
})

const ProfilePage = async () => {
  // Vars
  const data = await getProfileData()

  return <UserProfile data={data} tabContentList={tabContentList(data)} />
}

export default ProfilePage
