import Link from 'next/link'
import Card from '@/components/ui/Card'

interface Post {
  id: string
  title: string
  content: string
  slug?: string
  createdAt?: string
  category?: {
    id: string
    name: string
  } | null
}

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const slug = post.slug || post.id

  return (
    <Card className="p-6 hover:shadow-lg transition">
      <Link href={`/blog/${slug}`}>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-semibold hover:text-blue-500 transition">
            {post.title}
          </h2>
          {post.category && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
              {post.category.name}
            </span>
          )}
        </div>
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
