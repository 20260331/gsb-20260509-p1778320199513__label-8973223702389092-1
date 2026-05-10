export interface User {
  id: string
  email: string
  name?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserInput {
  email: string
  name?: string
  password: string
}

export interface UpdateUserInput {
  email?: string
  name?: string
  password?: string
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}

export interface AuthUser {
  id: string
  email: string
  name?: string | null
}
