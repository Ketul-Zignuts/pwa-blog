// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: 'Home',
    href: '/admin/home',
    icon: 'ri-home-smile-line'
  },
  {
    label: 'Category',
    href: '/admin/categories',
    icon: 'ri-price-tag-line'
  },
  {
    label: 'Post',
    href: '/admin/posts',
    icon: 'ri-file-text-line'
  }
]

export default verticalMenuData
