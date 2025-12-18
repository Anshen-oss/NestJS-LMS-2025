import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('🌱 Starting seed...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // ═══════════════════════════════════════════════════════════
  //              NETTOYER ET RECRÉER
  // ═══════════════════════════════════════════════════════════

  console.log('🗑️ Cleaning existing data...');

  // Nettoyer dans l'ordre (à cause des foreign keys)
  await prisma.lesson.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.course.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Data cleaned');

  // ═══════════════════════════════════════════════════════════
  //                      ADMIN USER
  // ═══════════════════════════════════════════════════════════

  const admin = await prisma.user.create({
    data: {
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
          accountId: 'admin@test.com',
          providerId: 'credential',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });

  console.log('✅ Admin created:', admin.email);

  // ═══════════════════════════════════════════════════════════
  //                      REGULAR USER
  // ═══════════════════════════════════════════════════════════

  const user = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      email: 'user@test.com',
      name: 'User Test',
      emailVerified: true,
      role: UserRole.STUDENT,
      createdAt: new Date(),
      updatedAt: new Date(),
      accounts: {
        create: {
          id: crypto.randomUUID(),
          accountId: 'user@test.com',
          providerId: 'credential',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });

  console.log('✅ User created:', user.email);

  // ═══════════════════════════════════════════════════════════
  //                    INSTRUCTOR USER
  // ═══════════════════════════════════════════════════════════

  const instructor = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      email: 'instructor@test.com',
      name: 'Instructor Test',
      emailVerified: true,
      role: UserRole.INSTRUCTOR,
      createdAt: new Date(),
      updatedAt: new Date(),
      accounts: {
        create: {
          id: crypto.randomUUID(),
          accountId: 'instructor@test.com',
          providerId: 'credential',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });

  console.log('✅ Instructor created:', instructor.email);

  // ═══════════════════════════════════════════════════════════
  //                    SAMPLE COURSES
  // ═══════════════════════════════════════════════════════════

  const course1 = await prisma.course.create({
    data: {
      title: 'Introduction à NestJS',
      slug: 'introduction-a-nestjs',
      description:
        'Apprendre les bases de NestJS et créer des APIs robustes avec TypeScript, GraphQL et Prisma.',
      smallDescription: 'Bases de NestJS',
      price: 49.99,
      category: 'Backend',
      level: 'Beginner',
      status: 'Published',
      userId: admin.id,
    },
  });

  console.log('✅ Course created:', course1.title);

  const course2 = await prisma.course.create({
    data: {
      title: 'GraphQL Avancé',
      slug: 'graphql-avance',
      description:
        'Maîtriser GraphQL avec NestJS, Apollo Server, DataLoader et les meilleures pratiques.',
      smallDescription: 'GraphQL + NestJS',
      price: 79.99,
      category: 'Backend',
      level: 'Intermediate',
      status: 'Published',
      userId: instructor.id,
    },
  });

  console.log('✅ Course created:', course2.title);

  // ═══════════════════════════════════════════════════════════
  //                      CHAPTERS
  // ═══════════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════════
  //                       LESSONS
  // ═══════════════════════════════════════════════════════════

  await prisma.lesson.createMany({
    data: [
      {
        title: 'Bienvenue dans le cours',
        description:
          'Introduction au cours NestJS - ce que vous allez apprendre',
        order: 1,
        isFree: true,
        duration: 300,
        chapterId: chapter1.id,
      },
      {
        title: 'Installation de NestJS',
        description: 'Comment installer et configurer NestJS sur votre machine',
        order: 2,
        isFree: true,
        duration: 420,
        chapterId: chapter1.id,
      },
      {
        title: 'Créer votre premier module',
        description: 'Apprendre à créer des modules dans NestJS',
        order: 1,
        isFree: false,
        duration: 600,
        chapterId: chapter2.id,
      },
      {
        title: 'Les Controllers en détail',
        description: 'Comment créer et utiliser les controllers',
        order: 2,
        isFree: false,
        duration: 720,
        chapterId: chapter2.id,
      },
    ],
  });

  console.log('✅ Lessons created');

  // ═══════════════════════════════════════════════════════════
  //                       SUMMARY
  // ═══════════════════════════════════════════════════════════

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📧 Credentials (password for all: password123)');
  console.log('─'.repeat(50));
  console.log(`👑 Admin:      ${admin.email}`);
  console.log(`👤 User:       ${user.email}`);
  console.log(`🎓 Instructor: ${instructor.email}`);
  console.log('');
  console.log('📚 Courses: 2');
  console.log('📖 Chapters: 2');
  console.log('📝 Lessons: 4');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
