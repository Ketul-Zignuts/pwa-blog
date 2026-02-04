import type { Metadata } from 'next'
import AdminPostView from '@/views/Admin/posts/AdminPostView'
import AdminPostAdd from '@/views/Admin/posts/AdminPostAdd'

export const metadata: Metadata = {
  title: 'Create  Post | Admin Panel',
  description: 'Admin page to create blog posts.',
  robots: {
    index: false,
    follow: false
  }
}

export default function Page() {
  return <AdminPostAdd />
}