'use client'

// React Imports
import { useEffect, useState } from 'react'
import type { ReactElement, SyntheticEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
import UserProfileHeader from './UserProfileHeader'
import CustomTabList from '@core/components/mui/TabList'
import { useSearchParams } from 'next/navigation'

type Props = {
  tabContentList: { [key: string]: ReactElement }
  fromUser: boolean
  editable: boolean
  validTabList: string[]
}

const UserProfile = ({ tabContentList, fromUser, editable, validTabList }: Props) => {
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab') || 'profile'
  const [activeTab, setActiveTab] = useState('profile')

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  useEffect(() => {
    if (tabFromUrl && validTabList?.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader fromUser={fromUser} editable={editable} />
      </Grid>
      {activeTab === undefined ? null : (
        <Grid item xs={12} className='flex flex-col gap-6'>
          <TabContext value={activeTab}>
            <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
              <Tab
                label={
                  <div className='flex items-center gap-1.5'>
                    <i className='ri-user-3-line text-lg' />
                    Profile
                  </div>
                }
                value='profile'
              />
              <Tab
                label={
                  <div className='flex items-center gap-1.5'>
                    <i className='ri-lock-password-line text-lg' />
                    Change Password
                  </div>
                }
                value='change-password'
              />
              <Tab
                label={
                  <div className='flex items-center gap-1.5'>
                    <i className='ri-article-line text-lg' />
                    My Posts
                  </div>
                }
                value='my-posts'
              />
              <Tab
                label={
                  <div className='flex items-center gap-1.5'>
                    <i className='ri-user-follow-line text-lg' />
                    My Followers
                  </div>
                }
                value='my-follower'
              />
            </CustomTabList>

            <TabPanel value={activeTab} className='p-0'>
              {tabContentList[activeTab]}
            </TabPanel>
          </TabContext>
        </Grid>
      )}
    </Grid>
  )
}

export default UserProfile
