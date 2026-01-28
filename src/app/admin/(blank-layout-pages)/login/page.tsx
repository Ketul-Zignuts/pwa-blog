// Next Imports
import type { Metadata } from 'next'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import AdminLogin from '@/views/Admin/login/Login'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your admin account'
}

const LoginPage = () => {
  // Vars
  const mode = getServerMode()

  return <AdminLogin mode={mode} />
}

export default LoginPage
