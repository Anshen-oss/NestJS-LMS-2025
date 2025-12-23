import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../src/app.module';
import { CoursesService } from '../src/modules/courses/courses.service';

const prisma = new PrismaClient();

async function main() {
  // 🆕 Créer l'application NestJS pour accéder aux services
  const app = await NestFactory.createApplicationContext(AppModule);
  const coursesService = app.get(CoursesService);

  console.log('🌱 Starting seed with Stripe auto-creation...');

  // Nettoyer les données existantes (sauf Users)
  console.log('🧹 Cleaning course data...');
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.course.deleteMany();

  console.log('✅ Old data cleaned');

  // Récupérer les users existants
  const users = await prisma.user.findMany();
  console.log(`👤 Found ${users.length} existing users`);

  if (users.length === 0) {
    console.error('❌ No users found. Please create users via Clerk first.');
    await app.close();
    return;
  }

  // Trouver un instructor
  let instructor = users.find((u) => u.role === 'INSTRUCTOR');
  if (!instructor) {
    instructor = users.find((u) => u.role === 'ADMIN');
  }
  if (!instructor) {
    instructor = users[0];
  }

  console.log(`👨‍🏫 Instructor: ${instructor.email}`);

  // Trouver un student
  let student = users.find((u) => u.role === 'STUDENT');
  if (!student) {
    student = users[users.length - 1];
  }

  console.log(`👨‍🎓 Student: ${student?.email || 'No student found'}`);

  // 🆕 Créer des cours via le SERVICE (auto-création Stripe)
  console.log('📚 Creating courses with Stripe auto-creation...');

  const course1 = await coursesService.create(instructor.id, {
    title: 'Introduction à TypeScript',
    description: '<p>Un cours complet pour maîtriser TypeScript de A à Z.</p>',
    smallDescription: 'Apprenez les bases de TypeScript',
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea',
    price: 49.99,
    category: 'Développement Web',
    level: 'Beginner',
    status: 'Published',
  });

  const course2 = await coursesService.create(instructor.id, {
    title: 'NestJS Avancé',
    description: '<p>Développez des APIs robustes avec NestJS et GraphQL.</p>',
    smallDescription: 'Maîtrisez NestJS pour le backend',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    price: 79.99,
    category: 'Backend',
    level: 'Advanced',
    status: 'Published',
  });

  const course3 = await coursesService.create(instructor.id, {
    title: 'GraphQL & Apollo Client',
    description: '<p>Créez des APIs GraphQL performantes avec Apollo.</p>',
    smallDescription: 'GraphQL pour les APIs modernes',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    price: 59.99,
    category: 'Backend',
    level: 'Intermediate',
    status: 'Published',
  });

  console.log('✅ 3 courses created with Stripe products');

  // Créer des chapitres
  console.log('📖 Creating chapters...');

  const chapter1 = await prisma.chapter.create({
    data: {
      title: 'Introduction à TypeScript',
      position: 1,
      courseId: course1.id,
    },
  });

  const chapter2 = await prisma.chapter.create({
    data: {
      title: 'Les Types de Base',
      position: 2,
      courseId: course1.id,
    },
  });

  const chapter3 = await prisma.chapter.create({
    data: {
      title: 'Types Avancés',
      position: 3,
      courseId: course1.id,
    },
  });

  console.log('✅ 3 chapters created');

  // Créer des leçons
  console.log('📝 Creating lessons...');

  await prisma.lesson.create({
    data: {
      title: "Qu'est-ce que TypeScript ?",
      content:
        '<p>TypeScript est un sur-ensemble de JavaScript qui ajoute des types statiques.</p>',
      order: 1,
      chapterId: chapter1.id,
      duration: 600,
      isPublished: true,
      isFree: true,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Installation et Configuration',
      content: '<p>Installez TypeScript avec npm install -g typescript</p>',
      order: 2,
      chapterId: chapter1.id,
      duration: 900,
      isPublished: true,
      isFree: false,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'String et Number',
      content: '<p>Les types primitifs en TypeScript</p>',
      order: 1,
      chapterId: chapter2.id,
      duration: 750,
      isPublished: true,
      isFree: false,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Arrays et Tuples',
      content: '<p>Travailler avec des tableaux typés</p>',
      order: 2,
      chapterId: chapter2.id,
      duration: 800,
      isPublished: true,
      isFree: false,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Interfaces',
      content: '<p>Définir la structure des objets</p>',
      order: 1,
      chapterId: chapter3.id,
      duration: 900,
      isPublished: true,
      isFree: false,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Generics',
      content: '<p>Créer des composants réutilisables</p>',
      order: 2,
      chapterId: chapter3.id,
      duration: 1000,
      isPublished: true,
      isFree: false,
    },
  });

  console.log('✅ 6 lessons created');

  // Créer des enrollments
  if (student) {
    console.log('🎓 Creating enrollments...');

    const userExists = await prisma.user.findUnique({
      where: { id: student.id },
    });

    if (!userExists) {
      console.error('❌ Student ID not found in User table!');
      await app.close();
      return;
    }

    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: course1.id,
        status: 'Active',
        amount: 49.99,
      },
    });

    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: course2.id,
        status: 'Active',
        amount: 79.99,
      },
    });

    console.log('✅ Enrollments created');
  } else {
    console.log('⚠️ No student found, skipping enrollments');
  }

  console.log('');
  console.log('🎉 Seed completed with Stripe integration!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - ${users.length} users (preserved)`);
  console.log('   - 3 courses (with Stripe products ✅)');
  console.log('   - 3 chapters');
  console.log('   - 6 lessons');
  console.log(`   - ${student ? '2' : '0'} enrollments`);

  // 🆕 Fermer l'application NestJS
  await app.close();
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
