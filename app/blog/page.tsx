'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { CategoryWithPostCount, PostWithAuthor } from '@/lib/types/post'

export default function BlogPage() {
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [categories, setCategories] = useState<CategoryWithPostCount[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [selectedCategory])

  const fetchPosts = async () => {
    try {
      const url = selectedCategory
        ? `/api/posts?published=true&categoryId=${selectedCategory}`
        : '/api/posts?published=true'
      const res = await fetch(url)
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories?includePosts=true')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

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

      {/* Category Filter */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2 text-gray-700">Filter by Category</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === ''
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Posts
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
              <span className="ml-1 text-xs opacity-75">
                ({category._count?.posts || 0})
              </span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No posts found.</p>
          <p className="mt-2">Try selecting a different category!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block p-6 bg-white border rounded-lg hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-600 line-clamp-2">{post.content}</p>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <span>By {post.author.name || 'Anonymous'}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {post.category && (
                  <span className="ml-4 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full whitespace-nowrap">
                    {post.category.name}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
