import type { Metadata } from 'next'
import AdminPostView from '@/views/Admin/posts/AdminPostView'

export const metadata: Metadata = {
  title: 'Create  Post | Admin Panel',
  description: 'Admin page to create and manage blog posts.',
  robots: {
    index: false,
    follow: false
  }
}

export default function Page() {
  return <AdminPostView />
}