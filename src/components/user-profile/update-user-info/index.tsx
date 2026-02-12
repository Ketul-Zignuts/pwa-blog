'use client'
import CustomTextInput from '@/components/form/CustomTextInput'
import { profileUpdateAction } from '@/constants/api/profile'
import { profileUpdateSchema } from '@/constants/schema/general/profileSchema'
import { useAppDispatch, useAppSelector } from '@/store'
import { updateUser } from '@/store/slices/authSlice'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Grid, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type ProfileUpdateProp = {
  bio: string | null | undefined
  displayName: string | null | undefined
  phoneNumber: string | null | undefined
}

const UpdateUserInfo = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state)=>state.auth.user)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileUpdateSchema),
    reValidateMode: 'onChange',
    mode: 'all',
    defaultValues: {
      bio: '',
      displayName: '',
      phoneNumber: ''
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (profileUpdateForm: any) => profileUpdateAction(profileUpdateForm),
    onSuccess: (response: any) => {
      if (response?.success) {
        const userPayload = {
          ...user,
          bio:response?.bio || '',
          displayName:response?.displayName || '',
          phoneNumber:response?.phoneNumber || '',
        }
        dispatch(updateUser(userPayload))
        toast.success('Profile successfully updated')
      } else {
        toast.error(response?.message || 'Update failed')
      }
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || 'Profile update failed!';
      toast.error(message)
    },
  })

  const onSubmit = async (data: any) => {
    await mutate(data);
  };

  useEffect(() => {
    const formatPhoneForInput = (phone?: string | null) => {
    if (!phone) return ''
    let cleaned = phone.replace('+', '')
    if (cleaned.startsWith('91') && cleaned.length > 10) {
      cleaned = cleaned.slice(2)
    }

    return cleaned
  }
    reset({
      bio: user?.bio || '',
      displayName: user?.displayName || '',
      phoneNumber: formatPhoneForInput(user?.phoneNumber)
    })
  }, [user])
  

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h6">
            Update User Info
          </Typography>
        }
        subheader={`Fill out the form below to update your information`}
      />
      <CardContent>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <CustomTextInput
              control={control as any}
              variant='outlined'
              rules={{}}
              errors={errors}
              id='displayName'
              name='displayName'
              placeholder='UserName'
              label='UserName'
              type='text'
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextInput
              id='phoneNumber'
              control={control}
              name="phoneNumber"
              label="Phone Number"
              placeholder="Enter your Phone Number"
              type={'tel'}
              fullWidth
              icon={<i className='ri-phone-line' />}
              errors={errors}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextInput
              id='bio'
              control={control}
              name="bio"
              label="Bio"
              placeholder="Tell us about yourself and your blog..."
              type={'text'}
              fullWidth
              errors={errors}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 5 }}>
              <Button variant="contained" color='info' type="button" disabled={isPending} startIcon={isPending ? <CircularProgress color='warning' size={20} /> : null} onClick={handleSubmit(onSubmit)}>
                Update Profile
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default UpdateUserInfo