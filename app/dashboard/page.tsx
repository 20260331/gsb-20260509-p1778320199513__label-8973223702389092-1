'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/components/providers/AuthProvider'

interface Category {
  id: string
  name: string
}

interface Post {
  id: string
  title: string
  content: string
  slug: string
  published: boolean
  createdAt: string
  category: Category | null
}

interface PostFormData {
  title: string
  content: string
  slug: string
  published: boolean
  categoryId: string
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [filterCategoryId, setFilterCategoryId] = useState<string>('')

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    defaultValues: {
      title: '',
      content: '',
      slug: '',
      published: false,
      categoryId: '',
    },
  })

  const watchTitle = watch('title')

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchPosts()
      fetchCategories()
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchPosts()
    }
  }, [filterCategoryId])

  const fetchPosts = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filterCategoryId) {
        params.set('categoryId', filterCategoryId)
      }
      const url = `/api/posts${params.toString() ? `?${params.toString()}` : ''}`
      const res = await fetch(url)
      const data = await res.json()
      setPosts(data)
    } catch {
      setError('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }, [filterCategoryId])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch {
      console.error('Failed to fetch categories')
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  useEffect(() => {
    if (!editingPost && watchTitle) {
      setValue('slug', generateSlug(watchTitle))
    }
  }, [watchTitle, editingPost, setValue])

  const onSubmit = async (data: PostFormData) => {
    setError('')
    setSaving(true)

    try {
      const url = editingPost ? `/api/posts/${editingPost.id}` : '/api/posts'
      const method = editingPost ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          categoryId: data.categoryId || null,
          authorId: user?.id,
        }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        setError(responseData.error || 'Failed to save post')
        return
      }

      await fetchPosts()
      resetForm()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    reset({
      title: post.title,
      content: post.content,
      slug: post.slug,
      published: post.published,
      categoryId: post.category?.id || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchPosts()
      }
    } catch {
      setError('Failed to delete post')
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingPost(null)
    reset({
      title: '',
      content: '',
      slug: '',
      published: false,
      categoryId: '',
    })
    setError('')
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          + New Post
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.title ? 'border-red-500' : ''
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  {...register('slug', { required: 'Slug is required' })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.slug ? 'border-red-500' : ''
                  }`}
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  {...register('categoryId')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">No category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  {...register('content', { required: 'Content is required' })}
                  rows={8}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.content ? 'border-red-500' : ''
                  }`}
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  {...register('published')}
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="text-sm">Publish immediately</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingPost ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-600">Filter by Category:</label>
        <select
          value={filterCategoryId}
          onChange={(e) => setFilterCategoryId(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No posts yet.</p>
          <p className="mt-2">Create your first post to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Title</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Category</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{post.title}</div>
                    <div className="text-sm text-gray-500">/blog/{post.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    {post.category ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                        {post.category.name}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Uncategorized</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        post.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
