// Next Imports
import type { Metadata } from 'next'

// Server Action Imports
import Register from '@/views/general/register/Register'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Register your account'
}

const LoginPage = () => {

  return <Register />
}

export default LoginPage
