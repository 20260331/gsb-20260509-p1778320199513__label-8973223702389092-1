import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db/db'

const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includePosts = searchParams.get('includePosts') === 'true'

    const categories = await prisma.category.findMany({
      include: includePosts
        ? {
            _count: {
              select: { posts: true },
            },
          }
        : undefined,
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(categories, { status: 200 })
  } catch (error) {
    console.error('Fetch categories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = createCategorySchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { name, slug } = result.data

    const existingName = await prisma.category.findUnique({
      where: { name },
    })
    if (existingName) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      )
    }

    const existingSlug = await prisma.category.findUnique({
      where: { slug },
    })
    if (existingSlug) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 409 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
