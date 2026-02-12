import { useState } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CustomTextInput from '@/components/form/CustomTextInput'
import { useFormContext } from 'react-hook-form'
import CustomDropzoneInput from '@/components/form/CustomDropzoneInput'
import Link from 'next/link'

const RegisterField = () => {
  const { control, trigger, formState: { errors } } = useFormContext();
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  return (
    <>
      <div className='mbe-5'>
        <Typography variant='h4'>Account Information</Typography>
        <Typography>Enter Your Account Details</Typography>
      </div>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            control={control as any}
            variant='outlined'
            rules={{}}
            errors={errors}
            id='email'
            name='email'
            placeholder='Email'
            label='Email'
            type='email'
            extraTextFieldProps={{
              InputLabelProps: {
                shrink: true
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
            extraTextFieldProps={{
              InputLabelProps: {
                shrink: true
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
          <CustomDropzoneInput
            control={control}
            name="photoURL"
            label="Profile pic"
            errors={errors}
            trigger={trigger}
          />
        </Grid>
        <Grid item xs={12}>
          <div className='flex items-center gap-x-1 gap-y-1 flex-wrap'>
            <Typography>
              Already have an account?
            </Typography>
            <Typography
              color='primary'
              component={Link}
              href={'/login'} // make sure this points to your login page
              className='cursor-pointer'
            >
              Log in here
            </Typography>
          </div>
        </Grid>
      </Grid>
    </>
  )
}

export default RegisterField
