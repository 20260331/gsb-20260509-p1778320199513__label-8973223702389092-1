import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold mb-4">404</h2>
      <p className="text-gray-600 mb-4">Page not found</p>
      <Link
        href="/"
        className="text-blue-500 hover:underline"
      >
        Return Home
      </Link>
    </div>
  )
}
