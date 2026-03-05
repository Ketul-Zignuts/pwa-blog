export type FilterInfiniteBlogData = {
  pages: FilterInfiniteBlogPage[]
  pageParams: number[]
}

export type FilterInfiniteBlogPage = {
  success: boolean
  data: FilterInfiniteBlog[]
  hasMore: boolean
  total: number
}

export type FilterInfiniteBlog = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  hero_image: string
  published_at: string
  views: number
  likes: number
  tags: string[]
  comments_count: number
  average_rating: number
  category: Category
  user: BlogUser
  isLiked: boolean
}

type Category = {
  id: string
  name: string
  slug: string
}

type BlogUser = {
  uid: string
  email: string
  photoURL: string
  displayName: string
}