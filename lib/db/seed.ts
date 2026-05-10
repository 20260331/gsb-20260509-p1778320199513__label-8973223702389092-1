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

  const categories = [
    { name: 'Technology' },
    { name: 'Tutorial' },
    { name: 'News' },
  ]

  const categoryRecords: Record<string, { id: string }> = {}
  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name },
    })
    categoryRecords[cat.name] = record
    console.log('Created category:', cat.name)
  }

  // Create sample posts
  const posts = [
    {
      title: 'Welcome to the Blog',
      content: 'This is the first post on our blog. Welcome to our community!',
      slug: 'welcome-to-the-blog',
      published: true,
      categoryName: 'News',
    },
    {
      title: 'Getting Started with Next.js',
      content: 'Next.js is a powerful React framework that enables server-side rendering and static site generation.',
      slug: 'getting-started-with-nextjs',
      published: true,
      categoryName: 'Tutorial',
    },
    {
      title: 'Understanding Prisma ORM',
      content: 'Prisma is a modern database toolkit that makes it easy to work with databases in Node.js and TypeScript.',
      slug: 'understanding-prisma-orm',
      published: false,
      categoryName: 'Technology',
    },
  ]

  for (const post of posts) {
    const createdPost = await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        content: post.content,
        slug: post.slug,
        published: post.published,
        authorId: adminUser.id,
        categoryId: categoryRecords[post.categoryName]?.id || null,
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
