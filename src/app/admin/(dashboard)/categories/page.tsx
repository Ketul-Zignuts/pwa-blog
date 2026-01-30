import type { Metadata } from 'next'
import AdminCategoryView from '@/views/Admin/categories/AdminCategoryView'

export const metadata: Metadata = {
  title: 'Create Category | Admin Panel',
  description: 'Admin page to create and manage blog categories.',
  robots: {
    index: false,
    follow: false
  }
}

export default function Page() {
  return <AdminCategoryView />
}