'use client'
import CustomTextInput from '@/components/form/CustomTextInput'
import { changePassWordAction } from '@/constants/api/profile'
import { changePasswordSchema } from '@/constants/schema/general/profileSchema'
import { useAppSelector } from '@/store'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Grid, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type ChangePassWordStateProps = {
  currentPassword: boolean
  newPassword: boolean
  confirmPassword: boolean
}

const ChangePassword = () => {
  const user = useAppSelector((state)=>state.auth.user);

  const [showPassword, setShowPassWord] = useState<ChangePassWordStateProps>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    reValidateMode: 'onChange',
    mode: 'all',
    defaultValues: {
      provider:'email',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (passwordForm: any) => changePassWordAction(passwordForm),
    onSuccess: (response: any) => {
      if (response?.success) {
        toast.success('Password successfully updated')
      } else {
        toast.error(response?.message || 'Update failed')
      }
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || 'Change Password failed!';
      toast.error(message)
    },
  })

  const onSubmit = async (data: any) => {
    await mutate(data);
  };

  const handleClickShowPassword = (field: keyof ChangePassWordStateProps) => {
    setShowPassWord(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  useEffect(() => {
    if(user?.provider) setValue('provider',user?.provider, { shouldValidate:true })
  }, [user])
  

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h6">
            Update Password
          </Typography>
        }
        subheader={`Fill out the form below to change your current password`}
      />
      <CardContent>
        <Grid container spacing={5}>
        {user?.provider !== 'google' && (
          <Grid item xs={12}>
            <CustomTextInput
              id='currentPassword'
              control={control}
              name="currentPassword"
              label="Old Password"
              placeholder="Enter your old password"
              type={showPassword?.currentPassword ? 'text' : 'password'}
              fullWidth
              icon={<i className={showPassword?.currentPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />}
              onIconPress={() => handleClickShowPassword('currentPassword')}
              errors={errors}
              extraTextFieldProps={{
                InputLabelProps: {
                  shrink: true
                }
              }}
            />
          </Grid>
        )}
          <Grid item xs={12}>
            <CustomTextInput
              id='newPassword'
              control={control}
              name="newPassword"
              label="New Password"
              placeholder="Enter your new password"
              type={showPassword?.newPassword ? 'text' : 'password'}
              fullWidth
              icon={<i className={showPassword?.newPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />}
              onIconPress={() => handleClickShowPassword('newPassword')}
              errors={errors}
              extraTextFieldProps={{
                InputLabelProps: {
                  shrink: true
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextInput
              id='confirmPassword'
              control={control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your new password"
              type={showPassword?.confirmPassword ? 'text' : 'password'}
              fullWidth
              icon={<i className={showPassword?.confirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />}
              onIconPress={() => handleClickShowPassword('confirmPassword')}
              errors={errors}
              extraTextFieldProps={{
                InputLabelProps: {
                  shrink: true
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 5 }}>
              <Button variant="contained" color='warning' type="button" disabled={isPending} startIcon={isPending ? <CircularProgress color='warning' size={20} /> : null} onClick={handleSubmit(onSubmit)}>
                Change Password
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ChangePassword