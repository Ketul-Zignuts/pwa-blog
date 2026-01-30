import React from 'react'
import BlogLogo from './BlogLogo'

const BlogSplashLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <BlogLogo className="w-24 h-24" animate={true} />
    </div>
  )
}

export default BlogSplashLoader