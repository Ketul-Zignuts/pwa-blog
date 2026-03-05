import type { Metadata } from 'next'
import themeConfig from '@/configs/themeConfig'
import FilterView from '@/views/general/blog/filter/FilterView'

export const metadata: Metadata = {
  title: `Filter Blogs | ${themeConfig?.templateName}`,
  description: 'Filter and search blog articles by category or keyword.',

  robots: {
    index: false,
    follow: false,
    nocache: true
  },

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`
  }
}

export default function Page() {
  return <FilterView />
}