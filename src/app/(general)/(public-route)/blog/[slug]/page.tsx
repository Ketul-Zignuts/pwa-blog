import { Metadata } from 'next'
import BlogDetail from '@/views/general/blog/BlogDetail'
import api from '@/lib/api'

type Props = {
  params: { slug: string }
}

async function getBlog(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/public/blog/${slug}`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data?.data
  } catch {
    return null
  }
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlog(params.slug)

  if (!blog) {
    return {
      title: 'Blog',
      description: 'Read our latest articles'
    }
  }

  return {
    title: blog?.seo_title || blog?.title,
    description: blog?.seo_description || blog?.excerpt,
    openGraph: {
      title: blog?.seo_title || blog?.title,
      description: blog?.seo_description || blog?.excerpt,
      images: blog?.hero_image
        ? [`${process.env.NEXT_PUBLIC_IMAGE_URL}/post-images/${blog?.hero_image}`]
        : [],
    },
  }
}

export default function BlogPage({ params }: Props) {
  return <BlogDetail slug={params.slug} />
}
