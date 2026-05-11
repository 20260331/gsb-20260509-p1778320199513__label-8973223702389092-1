import Link from 'next/link'
import prisma from '@/lib/db/db'

export const dynamic = 'force-dynamic'

async function getPosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return posts
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog</h1>
        <Link
          href="/"
          className="text-blue-500 hover:underline"
        >
          ← Back to Home
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No posts yet.</p>
          <p className="mt-2">Check back later for new content!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block p-6 bg-white border rounded-lg hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 line-clamp-2">{post.content}</p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span>By {post.author.name || 'Anonymous'}</span>
                <span className="mx-2">•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
