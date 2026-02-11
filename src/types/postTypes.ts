export type PostDataType = SinglePostData | null;

type PostCategory = {
  id?: string
  name: string
  slug: string
}

type PostUser = {
  id: string
  email: string
  displayName: string
  photoURL: string | null
}

export type SinglePostData = {
  id?: string | undefined | null
  title?: string
  slug?: string
  hero_image?: string | null
  status?: 'draft' | 'published' | 'archived'

  category?: PostCategory | null
  user?: PostUser | null
}

export type adminPostFilterParam = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}


export type PostDetailDataType = PostDetailProp | null | undefined

type PostDetailProp = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  status?: 'draft' | 'published' | 'archived'
  hero_image: string | null
  category_id: string
  user_id: string
  is_featured: boolean
  read_time: number | null
  tags: string[]
  seo_title: string | null
  seo_description: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}