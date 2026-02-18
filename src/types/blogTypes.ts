export interface BlogDetailProps {
  id: string
  user_id: string
  category_id: string

  title: string
  slug: string
  content: string
  excerpt: string

  hero_image: string

  status: 'draft' | 'published' | 'archived'
  is_featured: boolean

  read_time: number
  views: number
  likes: number
  word_count: number
  comments_count: number

  tags: string[]

  seo_title: string
  seo_description: string

  published_at: string | null
  created_at: string
  updated_at: string

  // ✅ NEW: Category relation
  category: {
    id: string
    name: string
    slug: string
  }

  // ✅ NEW: User relation
  user: {
    uid: string
    displayName: string
    bio: string
    photoURL: string
  }
}
