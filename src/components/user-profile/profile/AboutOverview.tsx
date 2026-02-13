'use client'
// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useAppSelector } from '@/store'

const AboutOverview = () => {
const user = useAppSelector((state)=>state.auth.user)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent className='flex flex-col gap-6'>
            <div className='flex flex-col gap-4'>
              <Typography variant='caption' className='uppercase'>
                About
              </Typography>
              <div className='flex items-center gap-2'>
                <i className={'ri-user-line text-textSecondary text-[22px]'} />
                <div className='flex items-center flex-wrap gap-2'>
                  <Typography className='font-medium'>
                    Name:
                  </Typography>
                  <Typography>{user?.displayName}</Typography>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <i className={'ri-mail-line text-textSecondary text-[22px]'} />
                <div className='flex items-center flex-wrap gap-2'>
                  <Typography className='font-medium'>
                    Email:
                  </Typography>
                  <Typography>{user?.email}</Typography>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <i className={'ri-phone-line text-textSecondary text-[22px]'} />
                <div className='flex items-center flex-wrap gap-2'>
                  <Typography className='font-medium'>
                    Phone Number:
                  </Typography>
                  <Typography>{user?.phoneNumber}</Typography>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='flex items-center flex-wrap gap-2'>
                  <Typography className='font-medium'>
                    Bio:
                  </Typography>
                  <Typography>{user?.bio || '-'}</Typography>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AboutOverview
