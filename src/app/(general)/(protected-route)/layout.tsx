import type { ChildrenType } from '@core/types'
import AuthGuard from '@/guard/AuthGuard'

const Layout = async ({ children }: ChildrenType) => {

  return (
    <AuthGuard pageType='user'>
      {children}
    </AuthGuard>
  )
}

export default Layout
