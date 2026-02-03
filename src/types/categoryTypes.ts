export type CategoryDataType = SingleCategoryData | null;

type SingleCategoryData = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  post_count: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type adminCategoryFilterParam = {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}