import Link from 'next/link'
import Card from '@/components/ui/Card'

interface Post {
  id: string
  title: string
  content: string
  slug?: string
  createdAt?: string
}

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const slug = post.slug || post.id

  return (
    <Card className="p-6 hover:shadow-lg transition">
      <Link href={`/blog/${slug}`}>
        <h2 className="text-xl font-semibold mb-2 hover:text-blue-500 transition">
          {post.title}
        </h2>
      </Link>
      <p className="text-gray-600 line-clamp-3">{post.content}</p>
      {post.createdAt && (
        <p className="text-sm text-gray-400 mt-4">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
      )}
    </Card>
  )
}
