import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db/db'

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  slug: z.string().min(1, 'Slug is required'),
  authorId: z.string().min(1, 'Author ID is required'),
  published: z.boolean().optional().default(false),
  categoryId: z.string().nullable().optional(),
})

// GET /api/posts - Get all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const categoryId = searchParams.get('categoryId')

    const posts = await prisma.post.findMany({
      where: {
        ...(published !== null ? { published: published === 'true' } : {}),
        ...(categoryId ? { categoryId } : {}),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(posts, { status: 200 })
  } catch (error) {
    console.error('Fetch posts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = createPostSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { title, content, slug, authorId, published, categoryId } = result.data

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      )
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        published,
        authorId,
        categoryId: categoryId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
