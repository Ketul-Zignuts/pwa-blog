import type { Metadata } from 'next'
import AdminHome from '@/views/Admin/home/AdminHome'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Blog Analytics',
  description: 'Admin dashboard for managing blog content, analytics, posts, categories, and performance insights.',
  robots: {
    index: false,
    follow: false
  }
}

export default function Page() {
  return <AdminHome />
}
