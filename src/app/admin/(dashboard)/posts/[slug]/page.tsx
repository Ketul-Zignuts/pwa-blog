import type { Metadata } from 'next'
import AdminPostUpdate from '@/views/Admin/posts/AdminPostUpdate'

export const metadata: Metadata = {
  title: 'Update  Post | Admin Panel',
  description: 'Admin page to update blog posts.',
  robots: {
    index: false,
    follow: false
  }
}

export default function Page() {
  return <AdminPostUpdate />
}