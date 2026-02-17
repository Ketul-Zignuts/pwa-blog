'use client'

import { useQuery } from '@tanstack/react-query'
import { postDetailGetAction } from '@/constants/api/general/general'

type Props = {
  slug: string
}

const BlogDetail = ({ slug }: Props) => {
  const { data: postData, isLoading } = useQuery({
    queryKey: ['post-detail', slug],
    queryFn: () => postDetailGetAction(slug),
    enabled: !!slug,
  })

  const blog = postData?.data

  if (isLoading) return <div>Loading...</div>
  if (!blog) return <div>Not Found</div>

  return (
    <div>
      <h1>{blog.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  )
}

export default BlogDetail
