import type { ChildrenType } from '@core/types'
import AuthGuard from '@/guard/AuthGuard'
import Customizer from '@/@core/components/customizer'

const Layout = async ({ children }: ChildrenType) => {
  const direction = 'ltr'

  return (
    <AuthGuard pageType='admin'>
      {children}
      <Customizer dir={direction} disableDirection={true} />
    </AuthGuard>
  )
}

export default Layout
