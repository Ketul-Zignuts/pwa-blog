'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import type { Mode } from '@core/types'
import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'
import themeConfig from '@configs/themeConfig'
import { useImageVariant } from '@core/hooks/useImageVariant'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from '@/constants/schema/general/authSchema'
import { Box, CircularProgress } from '@mui/material'
import { useForm } from 'react-hook-form'
import CustomTextInput from '@/components/form/CustomTextInput'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppDispatch } from '@/store'
import { setAuthLoading, setAuthUser } from '@/store/slices/authSlice'
import { toast } from 'react-toastify'
import { loginAction } from '@/constants/api/auth'
import classNames from 'classnames'
import { useSettings } from '@/@core/hooks/useSettings'

type LoginProps = {
  email: string
  password: string
}

const AdminLogin = ({ mode }: { mode: Mode }) => {
  const { settings } = useSettings()
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    reValidateMode: 'onChange',
    mode: 'all',
    defaultValues: {
      email: '',
      password: ''
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (credentials: any) => loginAction(credentials),
    onMutate: () => {
      dispatch(setAuthLoading(true))
    },
    onSuccess: (userCredential: any) => {
      console.log('userCredential: ', userCredential);
      const token = userCredential?.token
      const user = userCredential?.user

      if (!userCredential?.success && (!user || !token)) {
        dispatch(setAuthLoading(false))
        return
      }

      dispatch(
        setAuthUser({
          user,
          token,
          isAdminLoggedIn: true
        })
      )

      toast.success('Login successful!')
      router.replace('/admin/home')
    },
    onError: (err: any) => {
      console.log('err: ', err);
      const message = err?.response?.data?.message || 'Login failed!';
      toast.error(message)
    },
    onSettled: () => {
      dispatch(setAuthLoading(false))
      queryClient.invalidateQueries({ queryKey: ['login'] })
    }
  })

  const onSubmit = async (data: LoginProps) => {
    await mutate(data);
  };

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classNames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <div className='plb-12 pis-12'>
          <img
            src={characterIllustration}
            alt='character-illustration'
            className='max-bs-[500px] max-is-full bs-auto'
          />
        </div>
        <Illustrations
          image1={{ src: '/images/illustrations/objects/tree-2.png' }}
          image2={null}
          maskImg={{ src: authBackground }}
        />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link
          href='/'
          className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'
        >
          <Logo />
        </Link>
        <div className='flex flex-col gap-5'>
          <div>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}!👋🏻`}</Typography>
            <Typography className='mbs-1'>Please sign-in to your account and start the adventure</Typography>
          </div>
          <Box className='flex flex-col gap-5'>

            <CustomTextInput
              control={control as any}
              variant='outlined'
              rules={{}}
              errors={errors}
              id='email'
              name='email'
              placeholder='Email'
              label='Email'
              type='text'
            />
            <CustomTextInput
              id='password'
              control={control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type={isPasswordShown ? 'text' : 'password'}
              fullWidth
              icon={<i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />}
              onIconPress={handleClickShowPassword}
              errors={errors}
            />
            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <Typography
                className='text-end'
                color='primary'
                component={Link}
                href={'/'}
              >
                Forgot password?
              </Typography>
            </div>
            <Button fullWidth variant='contained' type='button' disabled={isPending} onClick={handleSubmit(onSubmit)} startIcon={isPending ? <CircularProgress size={20} color='warning' /> : null}>
              Log In
            </Button>
            <Divider className='gap-3'>or</Divider>
            <Button
              variant="contained"
              startIcon={<i className="ri-google-fill text-base" style={{ color: '#131313' }} />}
              sx={{
                backgroundColor: '#FFF',
                color: '#131313',
                borderRadius: '4px',
                height: '40px',
                padding: '0 24px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '14px',
                fontFamily: '"Roboto", "Segoe UI", sans-serif',
                boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
                '&:hover': {
                  backgroundColor: '#FFF',
                  boxShadow: '0 1px 3px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)',
                  transform: 'translateY(-1px)'
                },
                '&:active': {
                  boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
                  transform: 'translateY(0)'
                },
                '& .MuiTouchRipple-root': {
                  color: 'rgba(255,255,255,.3)'
                }
              }}
              disableRipple
            >
              Log in with Google
            </Button>
          </Box>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
