'use client'

import { useState, useCallback } from 'react'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
  })

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Login failed')
      }

      const data = await response.json()
      setState({ user: data.user, isLoading: false, error: null })
      return data.user
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      setState((prev) => ({ ...prev, isLoading: false, error: message }))
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setState({ user: null, isLoading: false, error: null })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated: !!state.user,
    login,
    logout,
  }
}
