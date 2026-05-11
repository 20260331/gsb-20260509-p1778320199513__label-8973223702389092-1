import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Next.js Blog
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          A modern full-stack blog application built with Next.js 14, TypeScript, and Prisma
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/blog"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
          >
            View Blog
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition font-medium"
          >
            Register
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <h3 className="font-semibold text-lg mb-2">User Authentication</h3>
            <p className="text-gray-600 text-sm">
              Secure login and registration with password hashing
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <h3 className="font-semibold text-lg mb-2">Blog Posts</h3>
            <p className="text-gray-600 text-sm">
              Full CRUD operations for blog content management
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <h3 className="font-semibold text-lg mb-2">RESTful API</h3>
            <p className="text-gray-600 text-sm">
              Clean API routes with validation and error handling
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
