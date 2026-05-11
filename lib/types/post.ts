export interface Post {
  id: string
  title: string
  content: string
  slug: string
  published: boolean
  authorId: string
  categoryId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreatePostInput {
  title: string
  content: string
  slug?: string
  published?: boolean
  categoryId?: string | null
}

export interface UpdatePostInput {
  title?: string
  content?: string
  slug?: string
  published?: boolean
  categoryId?: string | null
}

export interface PostWithAuthor extends Post {
  author: {
    id: string
    name: string | null
    email: string
  }
}

export interface PostWithAuthorAndCategory extends PostWithAuthor {
  category: {
    id: string
    name: string
    slug: string
  } | null
}
