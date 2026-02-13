import type { Metadata } from 'next'
import HomeView from '@/views/general/home/HomeView'
import themeConfig from '@/configs/themeConfig'

export const metadata: Metadata = {
  title: `${themeConfig?.templateName} – Insights on React, Next.js & Modern Web Development`,
  description:
    'Explore trending articles, tutorials, and deep dives on React, Next.js, TypeScript, and modern web development.',

  keywords: [
    'React blog',
    'Next.js tutorials',
    'Web development',
    'JavaScript articles',
    'Frontend engineering'
  ],

  robots: {
    index: true,
    follow: true
  }
}

export default function Page() {
  return <HomeView />
}
