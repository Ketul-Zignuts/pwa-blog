'use client'

import React from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { useRouter, usePathname } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface AppBreadcrumbsProps {
  path: BreadcrumbItem[]
}

const AppBreadcrumbs = ({ path }: AppBreadcrumbsProps) => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Breadcrumbs
      separator={<i className="ri-arrow-right-s-line" />}
      aria-label="breadcrumb"
      sx={{ mb:4 }}
    >
      {path.map((item, index) => {
        const isLast = index === path.length - 1
        const isActive = item.href === pathname || isLast

        if (isActive) {
          return (
            <Typography
              key={index}
              color="primary"
              fontWeight={600}
            >
              {item.label}
            </Typography>
          )
        }

        return (
          <Link
            key={index}
            underline="hover"
            color="inherit"
            sx={{ cursor: 'pointer' }}
            onClick={() => item.href && router.push(item.href)}
          >
            {item.label}
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}

export default AppBreadcrumbs
