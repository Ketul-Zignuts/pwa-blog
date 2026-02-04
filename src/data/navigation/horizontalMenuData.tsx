// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
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

export default horizontalMenuData
