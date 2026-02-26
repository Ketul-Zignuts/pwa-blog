import PostForm from '@/views/general/blog/post/PostForm'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Create New Blog Post',
  description: 'Write and publish a new blog post on our platform.',
  robots: {
    index: false,
    follow: false,
  },
}

const Page = () => {
  return (<PostForm />)
}

export default Page