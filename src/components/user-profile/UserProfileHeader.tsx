'use client'

import { useRef } from 'react'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import { useAppDispatch, useAppSelector } from '@/store'
import { useMutation } from '@tanstack/react-query'
import { changeProfilePicAction } from '@/constants/api/profile'
import { toast } from 'react-toastify'
import { updateUser } from '@/store/slices/authSlice'

type UserProfileHeaderProps = {
  fromUser?: boolean
  editable?: boolean
}

const UserProfileHeader = ({ fromUser, editable }: UserProfileHeaderProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state?.auth?.user)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) =>
      changeProfilePicAction(formData),
    onSuccess: (response) => {
      if (response?.success && response?.photoURL) {
        dispatch(updateUser({ ...user, photoURL: response?.photoURL }))
        toast.success('Profile picture updated')
      } else {
        toast.error(response?.message || 'Update failed')
      }
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || 'Update failed!'
      toast.error(message)
    }
  })

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('photo', file)

    mutate(formData)
  }

  return (
    <Card>
      <CardMedia
        image={'/images/pages/profile-banner.png'}
        className='bs-[250px]'
      />

      <CardContent className='flex gap-6 justify-center flex-col items-center md:items-end md:flex-row !pt-0 md:justify-start'>
        {/* 🟢 Profile Image Container */}
        <div className='relative flex rounded-bs-md mbs-[-45px] border-[5px] border-backgroundPaper bg-backgroundPaper'>
          <img
            height={120}
            width={120}
            src={user?.photoURL}
            className='rounded'
            alt={user?.displayName}
          />

          {/* 🔥 Edit Icon */}
          {editable && (
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
              size='small'
              color='primary'
              sx={{
                position: 'absolute',
                bottom: 5,
                right: 5,
                boxShadow: 2,
                backgroundColor: 'primary.main'
              }}
            >
              {isPending ? (
                <CircularProgress size={16} />
              ) : (
                <i className='ri-edit-line text-white text-[22px]' />
              )}
            </IconButton>
          )}

          {/* Hidden Input */}
          <input
            type='file'
            hidden
            accept='image/*'
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        <div className='flex is-full flex-wrap justify-center flex-col items-center sm:flex-row sm:justify-between sm:items-end gap-5'>
          <div className='flex flex-col items-center sm:items-start gap-2'>
            <Typography variant='h4'>
              {user?.displayName}
            </Typography>
            <Typography variant='caption'>
              {user?.bio || user?.email}
            </Typography>
          </div>

          {!fromUser && (
            <Button variant='contained' className='flex gap-2'>
              <i className='ri-user-follow-line text-base'></i>
              <span>Connected</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default UserProfileHeader