export interface Post {
  id: string
  title: string
  content: string
  slug: string
  published: boolean
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreatePostInput {
  title: string
  content: string
  slug?: string
  published?: boolean
}

export interface UpdatePostInput {
  title?: string
  content?: string
  slug?: string
  published?: boolean
}

export interface PostWithAuthor extends Post {
  author: {
    id: string
    name: string | null
    email: string
  }
}
