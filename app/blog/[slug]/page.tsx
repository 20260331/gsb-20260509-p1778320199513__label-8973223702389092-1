import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/db/db'

export const dynamic = 'force-dynamic'

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      author: {
        select: { name: true, email: true },
      },
      category: true,
    },
  })
  return post
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-4xl mx-auto p-8">
      <Link
        href="/blog"
        className="text-blue-500 hover:underline mb-6 inline-block"
      >
        ← Back to Blog
      </Link>

      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span>By {post.author.name || 'Anonymous'}</span>
        <span className="mx-2">•</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      {post.category && (
        <div className="mb-6">
          <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
            {post.category.name}
          </span>
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>
    </article>
  )
}
