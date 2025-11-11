import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      email: 'admin@test.com',
      name: 'Admin Test',
      emailVerified: true,
      role: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
      accounts: {
        create: {
          id: crypto.randomUUID(),
          accountId: 'admin-account',
          providerId: 'credential',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      email: 'user@test.com',
      name: 'User Test',
      emailVerified: true,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
      accounts: {
        create: {
          id: crypto.randomUUID(),
          accountId: 'user-account',
          providerId: 'credential',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });

  console.log('✅ Regular user created:', user.email);

  // Create sample courses
  const course1 = await prisma.course.upsert({
    where: { slug: 'introduction-a-nestjs' },
    update: {},
    create: {
      title: 'Introduction à NestJS',
      slug: 'introduction-a-nestjs',
      description: 'Apprendre les bases de NestJS et créer des APIs robustes',
      smallDescription: 'Bases de NestJS',
      price: 49.99,
      category: 'Backend',
      level: 'Beginner',
      status: 'Published',
      userId: admin.id,
    },
  });

  console.log('✅ Course created:', course1.title);

  const course2 = await prisma.course.upsert({
    where: { slug: 'graphql-avance' },
    update: {},
    create: {
      title: 'GraphQL Avancé',
      slug: 'graphql-avance',
      description: 'Maîtriser GraphQL avec NestJS et Apollo',
      smallDescription: 'GraphQL + NestJS',
      price: 79.99,
      category: 'Backend',
      level: 'Intermediate',
      status: 'Published',
      userId: admin.id,
    },
  });

  console.log('✅ Course created:', course2.title);

  // Create chapters for course 1
  const chapter1 = await prisma.chapter.create({
    data: {
      title: 'Introduction',
      position: 1,
      courseId: course1.id,
    },
  });

  const chapter2 = await prisma.chapter.create({
    data: {
      title: 'Modules et Controllers',
      position: 2,
      courseId: course1.id,
    },
  });

  console.log('✅ Chapters created');

  // Create lessons
  await prisma.lesson.createMany({
    data: [
      {
        title: 'Bienvenue dans le cours',
        description: 'Introduction au cours NestJS',
        position: 1,
        isFree: true,
        duration: 300,
        chapterId: chapter1.id,
      },
      {
        title: 'Installation de NestJS',
        description: 'Comment installer et configurer NestJS',
        position: 2,
        isFree: true,
        duration: 420,
        chapterId: chapter1.id,
      },
      {
        title: 'Créer votre premier module',
        description: 'Apprendre à créer des modules dans NestJS',
        position: 1,
        isFree: false,
        duration: 600,
        chapterId: chapter2.id,
      },
    ],
  });

  console.log('✅ Lessons created');

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📧 Admin credentials:');
  console.log('   Email: admin@test.com');
  console.log('   Password: password123');
  console.log('');
  console.log('📧 User credentials:');
  console.log('   Email: user@test.com');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
