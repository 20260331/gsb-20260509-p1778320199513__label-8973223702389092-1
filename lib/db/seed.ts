import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create default admin user
  const hashedPassword = await hash('admin123', 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
    },
  })

  console.log('Created admin user:', adminUser.email)

  // Create sample categories
  const categories = [
    {
      name: 'Technology',
      slug: 'technology',
    },
    {
      name: 'Programming',
      slug: 'programming',
    },
    {
      name: 'Tutorial',
      slug: 'tutorial',
    },
    {
      name: 'General',
      slug: 'general',
    },
  ]

  const createdCategories: Record<string, string> = {}

  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
    createdCategories[category.slug] = createdCategory.id
    console.log('Created category:', createdCategory.name)
  }

  // Create sample posts
  const posts = [
    {
      title: 'Welcome to the Blog',
      content: 'This is the first post on our blog. Welcome to our community!',
      slug: 'welcome-to-the-blog',
      published: true,
      categorySlug: 'general',
    },
    {
      title: 'Getting Started with Next.js',
      content: 'Next.js is a powerful React framework that enables server-side rendering and static site generation.',
      slug: 'getting-started-with-nextjs',
      published: true,
      categorySlug: 'programming',
    },
    {
      title: 'Understanding Prisma ORM',
      content: 'Prisma is a modern database toolkit that makes it easy to work with databases in Node.js and TypeScript.',
      slug: 'understanding-prisma-orm',
      published: false,
      categorySlug: 'technology',
    },
  ]

  for (const post of posts) {
    const { categorySlug, ...postData } = post
    const createdPost = await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        categoryId: createdCategories[categorySlug],
      },
      create: {
        ...postData,
        authorId: adminUser.id,
        categoryId: createdCategories[categorySlug],
      },
    })
    console.log('Created post:', createdPost.title)
  }

  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
