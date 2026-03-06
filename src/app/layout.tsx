// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import Providers from '@/components/Providers'
  import { ToastContainer } from 'react-toastify';
import FirebaseNotification from '@/components/notifications/FirebaseNotification'


export const metadata = {
  title: 'Zignuts Blog-App',
  description:
    'Zignuts Blog App'
}

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  return (
    <html id='__next' lang='en' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <Providers direction='ltr'>
          <FirebaseNotification />
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
