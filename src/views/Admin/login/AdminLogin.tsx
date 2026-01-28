'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

// Type Imports
import type { Mode } from '@core/types'


// Component Imports
import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from '@/constants/schema/general/loginSchema'
import { Box } from '@mui/material'
import { useForm } from 'react-hook-form'
import CustomTextInput from '@/components/form/CustomTextInput'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppDispatch } from '@/store'
import { setAuthUser } from '@/store/slices/authSlice'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { loginAction } from '@/constants/api/auth'

// Util Imports
type LoginProps = {
  email: string
  password: string
}

const AdminLogin = ({ mode }: { mode: Mode }) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [showLoading,setShowLoading] = useState<boolean>(false);

  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const {
    control,
    handleSubmit,
    reset,
    watch,
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
  console.log('errors: ', errors);

const { mutate, isPending, error } = useMutation({
        mutationFn: (credentials) => loginAction(credentials), // Pass the credentials here
        onSuccess: async (userCredential) => {
            setShowLoading(true);
            const token = userCredential?.token;
            const user = userCredential?.user;
            if (!user || !token) return
            dispatch(setAuthUser({ user, token, isAdminLoggedIn: true }));
            toast.success('Login successful!');
            setShowLoading(false);
            router.replace('/admin/home');
        },
        onError: (err: any) => {
            setShowLoading(false);
            const message = err?.response?.data?.message || 'Login failed!';
            toast.error(message);
        },
        onSettled: () => {
            setShowLoading(false);
            queryClient.invalidateQueries({ queryKey: ['login'] });
        }
    });

    const onSubmit = async (data: any) => {
        await mutate(data);
    };

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href={'/'} className='flex justify-center items-center mbe-6'>
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
              <Button fullWidth variant='contained' type='button' onClick={handleSubmit(onSubmit)}>
                Log In
              </Button>
              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>New on our platform?</Typography>
                <Typography
                  component={Link}
                  href={'/'}
                  color='primary'
                >
                  Create an account
                </Typography>
              </div>
              <Divider className='gap-3'>or</Divider>

              <Button
                variant="contained"
                startIcon={<i className="ri-google-fill text-base" style={{ color:'#131313' }} />}
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
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default AdminLogin
