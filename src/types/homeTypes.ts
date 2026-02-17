export type PostItemDataProps = {
  id: string
  title: string
  slug: string
  excerpt: string
  hero_image: string | null
  published_at: string
  views: number
  likes: number
  tags: string[]
  content?:string
  comments_count?:number
  isLiked?:boolean
  category: {
    id: string
    name: string
    slug: string
  }
  user: {
    uid: string
    email: string
    photoURL: string | null
    displayName: string
  }
}
