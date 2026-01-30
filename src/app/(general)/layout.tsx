import type { ChildrenType } from '@core/types'
import AuthGuard from '@/guard/AuthGuard'
import BlankLayout from '@/@layouts/BlankLayout'
import { getSystemMode } from '@/@core/utils/serverHelpers'

const Layout = async ({ children }: ChildrenType) => {
  const systemMode = getSystemMode()

  return (
    <AuthGuard pageType='user'>
      <BlankLayout systemMode={systemMode}>{children}</BlankLayout>
    </AuthGuard>
  )
}

export default Layout
