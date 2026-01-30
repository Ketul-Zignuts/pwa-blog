'use client'

import Link from 'next/link'
import { useTheme } from '@mui/material/styles'
import classnames from 'classnames'
import RegisterField from '@/views/general/register/RegisterField'
import Logo from '@components/layout/shared/Logo'
import { useSettings } from '@core/hooks/useSettings'
import { Box, Button, CircularProgress, Grid } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registerSchema } from '@/constants/schema/general/authSchema'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { registerAction } from '@/constants/api/auth'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const defaultValues = {
  email: '',
  password: '',
  displayName: '',
  phoneNumber: '',
  bio: '',
  photoURL: null
}

const Register = () => {
  const theme = useTheme()
  const router = useRouter();
  const { settings } = useSettings()

  const methods = useForm({
    mode: 'onChange',
    defaultValues,
    shouldFocusError: true,
    resolver: yupResolver(registerSchema)
  })
  const { handleSubmit } = methods;

  const { mutate,isPending } = useMutation({
    mutationFn: (credentials) => registerAction(credentials),
    onSuccess: async (response) => {
      if (response?.success) {
        toast.success(response?.message)
        router.replace('/login');
      } else {
        const failMessage = response?.message || 'failed to register';
        toast.error(failMessage)
      }
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || 'Login failed!';
      toast.error(message);
    }
  });

  const onSubmit = async (data: any) => {
    await mutate(data);
  };

  return (
    <div className='flex bs-full justify-between items-center'>
      <div
        className={classnames('flex bs-full items-center justify-center is-[594px] max-md:hidden', {
          'border-ie': settings.skin === 'bordered'
        })}
      >
        <img
          src='/images/illustrations/characters/4.png'
          alt='multi-steps-character'
          className={classnames('mis-[92px] bs-auto max-bs-[628px] max-is-full', {
            'scale-x-[-1]': theme.direction === 'rtl'
          })}
        />
      </div>
      <div className='flex justify-center items-center bs-full is-full bg-backgroundPaper'>
        <Link
          href={'/'}
          className='absolute block-start-5 sm:block-start-[25px] inline-start-6 sm:inline-start-[25px]'
        >
          <Logo />
        </Link>
        <FormProvider {...methods}>
          <Box className='p-5 sm:p-8 is-[700px]'>
            <RegisterField />
            <Grid item xs={12} className='flex justify-between pt-5'>
              <Button
                color='primary'
                variant='contained'
                type='button'
                disabled={isPending}
                onClick={handleSubmit(onSubmit)}
                size='medium'
                fullWidth
                startIcon={isPending ? <CircularProgress size={20} color='warning' /> : null}
              >
                Register
              </Button>
            </Grid>
          </Box>
        </FormProvider>
      </div>
    </div>
  )
}

export default Register
