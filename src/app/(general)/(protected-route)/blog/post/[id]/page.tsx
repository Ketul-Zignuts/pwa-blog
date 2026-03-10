import PostEditView from '@/views/general/blog/post/PostEditView'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Update Blog Post',
  description: 'Write and publish a existing blog post on our platform.',
  robots: {
    index: false,
    follow: false,
  },
}

const Page = () => {
  return (<PostEditView />)
}

export default Page