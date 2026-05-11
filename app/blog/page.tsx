import Link from 'next/link'
import prisma from '@/lib/db/db'

export const dynamic = 'force-dynamic'

async function getPosts(categoryId?: string) {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...(categoryId ? { categoryId } : {}),
    },
    include: {
      author: {
        select: { name: true },
      },
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return posts
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
  return categories
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>
}) {
  const params = await searchParams
  const [posts, categories] = await Promise.all([
    getPosts(params.categoryId),
    getCategories(),
  ])

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

      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <Link
          href="/blog"
          className={`px-3 py-1 text-sm rounded-full transition ${
            !params.categoryId
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/blog?categoryId=${category.id}`}
            className={`px-3 py-1 text-sm rounded-full transition ${
              params.categoryId === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </Link>
        ))}
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
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                {post.category && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                    {post.category.name}
                  </span>
                )}
              </div>
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
