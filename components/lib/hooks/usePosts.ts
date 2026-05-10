'use client'

import { useState, useCallback, useEffect } from 'react'

interface Post {
  id: string
  title: string
  content: string
}

interface PostsState {
  posts: Post[]
  isLoading: boolean
  error: string | null
}

export function usePosts() {
  const [state, setState] = useState<PostsState>({
    posts: [],
    isLoading: false,
    error: null,
  })

  const fetchPosts = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/posts')

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const posts = await response.json()
      setState({ posts, isLoading: false, error: null })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch posts'
      setState((prev) => ({ ...prev, isLoading: false, error: message }))
    }
  }, [])

  const createPost = useCallback(async (title: string, content: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      const newPost = await response.json()
      setState((prev) => ({
        posts: [...prev.posts, newPost],
        isLoading: false,
        error: null,
      }))
      return newPost
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create post'
      setState((prev) => ({ ...prev, isLoading: false, error: message }))
      throw error
    }
  }, [])

  const deletePost = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      setState((prev) => ({
        posts: prev.posts.filter((post) => post.id !== id),
        isLoading: false,
        error: null,
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete post'
      setState((prev) => ({ ...prev, isLoading: false, error: message }))
      throw error
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return {
    posts: state.posts,
    isLoading: state.isLoading,
    error: state.error,
    fetchPosts,
    createPost,
    deletePost,
  }
}
