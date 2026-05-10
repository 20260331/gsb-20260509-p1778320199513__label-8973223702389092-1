const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)

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

  // Create sample posts
  const posts = [
    {
      title: 'Welcome to the Blog',
      content: 'This is the first post on our blog. Welcome to our community!',
      slug: 'welcome-to-the-blog',
      published: true,
    },
    {
      title: 'Getting Started with Next.js',
      content: 'Next.js is a powerful React framework that enables server-side rendering and static site generation.',
      slug: 'getting-started-with-nextjs',
      published: true,
    },
    {
      title: 'Understanding Prisma ORM',
      content: 'Prisma is a modern database toolkit that makes it easy to work with databases in Node.js and TypeScript.',
      slug: 'understanding-prisma-orm',
      published: false,
    },
  ]

  for (const post of posts) {
    const createdPost = await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        authorId: adminUser.id,
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
