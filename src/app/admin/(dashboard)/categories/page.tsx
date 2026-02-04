import type { Metadata } from 'next'
import AdmincategoryView from '@/views/Admin/categories/AdmincategoryView'

export const metadata: Metadata = {
  title: 'Create Category | Admin Panel',
  description: 'Admin page to create and manage blog categories.',
  robots: {
    index: false,
    follow: false
  }
}

export default function Page() {
  return <AdmincategoryView />
}