'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import AdminPostForm from '@/views/Admin/posts/AdminPostForm'
import { adminPostGetAction } from '@/constants/api/admin/posts'

const AdminPostUpdate = () => {
  const params = useParams()
  const slug = params?.slug as string

  const { data: postData, isLoading } = useQuery({
    queryKey: ['admin-post', slug],
    queryFn: () => adminPostGetAction(slug),
    enabled: !!slug,
  })

  return (
    <AdminPostForm data={postData?.data} />
  )
}

export default AdminPostUpdate
