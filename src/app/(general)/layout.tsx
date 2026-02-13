import type { ChildrenType } from '@core/types'
import AuthGuard from '@/guard/AuthGuard'
import BlankLayout from '@/@layouts/BlankLayout'
import { getSystemMode } from '@/@core/utils/serverHelpers'
import Customizer from '@/@core/components/customizer'

const Layout = async ({ children }: ChildrenType) => {
  const systemMode = getSystemMode()
  const direction = 'ltr'

  return (
    <BlankLayout systemMode={systemMode}>
      {children}
      <Customizer dir={direction} disableDirection={true} />
    </BlankLayout>
  )
}

export default Layout
