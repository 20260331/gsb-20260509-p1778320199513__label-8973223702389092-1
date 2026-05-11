import Link from 'next/link'

export default function BlogPostNotFound() {
  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
      <p className="text-gray-600 mb-4">
        The blog post you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/blog" className="text-blue-500 hover:underline">
        Back to Blog
      </Link>
    </div>
  )
}
