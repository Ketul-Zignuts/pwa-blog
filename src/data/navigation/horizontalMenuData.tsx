// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Home',
    href: '/admin/home',
    icon: 'ri-home-smile-line'
  },
  {
    label: 'About',
    href: '/admin/about',
    icon: 'ri-information-line'
  },
]

export default horizontalMenuData
