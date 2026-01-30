// Next Imports
import type { Metadata } from 'next'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import Register from '@/views/general/register/Register'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Register your account'
}

const LoginPage = () => {
  // Vars
  const mode = getServerMode()

  return <Register mode={mode} />
}

export default LoginPage
