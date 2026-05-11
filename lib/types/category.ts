export interface Category {
  id: string
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCategoryInput {
  name: string
  slug?: string
}

export interface UpdateCategoryInput {
  name?: string
  slug?: string
}

export interface CategoryWithPostCount extends Category {
  _count: {
    posts: number
  }
}
