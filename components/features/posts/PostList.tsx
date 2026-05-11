import PostCard from './PostCard'

interface Post {
  id: string
  title: string
  content: string
  slug?: string
  createdAt?: string
}

interface PostListProps {
  posts: Post[]
  emptyMessage?: string
}

export default function PostList({
  posts,
  emptyMessage = 'No posts found',
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
