import { EnrollmentStatus, PrismaClient, User, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script pour créer des données de test pour Analytics
 * VERSION AMÉLIORÉE: Plus de données sur les jours récents
 * Usage: npx ts-node prisma/seed-analytics-improved.ts
 */
async function main() {
  console.log('🌱 Seeding Analytics data (version améliorée)...\n');

  // 1. Trouve ton user instructeur
  const instructor = await prisma.user.findFirst({
    where: { role: UserRole.INSTRUCTOR },
    include: {
      coursesCreated: {
        include: {
          chapters: {
            include: {
              lessons: true,
            },
          },
        },
      },
    },
  });

  if (!instructor) {
    console.error('❌ Aucun instructeur trouvé!');
    return;
  }

  console.log(
    `✅ Instructeur trouvé: ${instructor.name} (${instructor.email})`,
  );

  if (instructor.coursesCreated.length === 0) {
    console.error("❌ L'instructeur n'a aucun cours!");
    return;
  }

  const courses = instructor.coursesCreated;
  console.log(`✅ Trouvé ${courses.length} cours\n`);

  // 2. Crée ou récupère des étudiants
  console.log('👥 Création des étudiants de test...');

  const studentEmails = [
    'student1@test.com',
    'student2@test.com',
    'student3@test.com',
    'student4@test.com',
    'student5@test.com',
    'student6@test.com',
    'student7@test.com',
    'student8@test.com',
  ];

  const students: User[] = [];
  for (const email of studentEmails) {
    let student = await prisma.user.findUnique({ where: { email } });

    if (!student) {
      student = await prisma.user.create({
        data: {
          clerkId: `test_${Math.random().toString(36).substr(2, 9)}`,
          email,
          name: `Student ${email.split('@')[0]}`,
          role: UserRole.STUDENT,
          emailVerified: true,
        },
      });
      console.log(`  ✅ Créé: ${student.name}`);
    } else {
      console.log(`  ♻️  Existe: ${student.name}`);
    }

    students.push(student);
  }

  console.log(`\n✅ ${students.length} étudiants prêts\n`);

  // 3. Crée des enrollments CONCENTRÉS sur les jours récents
  console.log('📚 Création des enrollments (focus sur jours récents)...');

  const now = new Date();
  let enrollmentCount = 0;

  // Distribution: 70% des enrollments dans les 7 derniers jours
  const distributionRanges = [
    { days: 7, weight: 0.7 }, // 70% dans les 7 derniers jours
    { days: 15, weight: 0.2 }, // 20% entre 8-15 jours
    { days: 30, weight: 0.1 }, // 10% entre 16-30 jours
  ];

  for (const course of courses) {
    // 3-5 enrollments par cours
    const numEnrollments = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < numEnrollments && i < students.length; i++) {
      const student = students[i];

      // Vérifie si déjà enrolled
      const existing = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: student.id,
            courseId: course.id,
          },
        },
      });

      if (existing) {
        console.log(
          `  ⏭️  Skip: ${student.name} déjà inscrit à ${course.title}`,
        );
        continue;
      }

      // Distribution pondérée des dates
      const random = Math.random();
      let daysAgo: number;

      if (random < 0.7) {
        // 70% dans les 7 derniers jours
        daysAgo = Math.floor(Math.random() * 7);
      } else if (random < 0.9) {
        // 20% entre 8-15 jours
        daysAgo = Math.floor(Math.random() * 8) + 7;
      } else {
        // 10% entre 16-30 jours
        daysAgo = Math.floor(Math.random() * 15) + 15;
      }

      const enrollDate = new Date(now);
      enrollDate.setDate(enrollDate.getDate() - daysAgo);

      // Prix entre 30€ et 150€
      const price = Math.floor(Math.random() * 120) + 30;

      await prisma.enrollment.create({
        data: {
          userId: student.id,
          courseId: course.id,
          amount: price,
          status: EnrollmentStatus.Active,
          createdAt: enrollDate,
        },
      });

      enrollmentCount++;
      console.log(
        `  ✅ ${student.name} → ${course.title} (${price}€, il y a ${daysAgo} jours)`,
      );
    }
  }

  console.log(`\n✅ ${enrollmentCount} enrollments créés\n`);

  // 4. Crée des VideoProgress pour simuler l'activité RÉCENTE
  console.log(
    '📹 Création des progressions vidéo (focus sur jours récents)...',
  );

  let progressCount = 0;

  for (const course of courses) {
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: course.id },
      include: { user: true },
    });

    for (const enrollment of enrollments) {
      const allLessons = course.chapters.flatMap((ch) => ch.lessons);

      if (allLessons.length === 0) continue;

      // 40-90% des lessons
      const numLessons = Math.max(
        1,
        Math.floor(allLessons.length * (0.4 + Math.random() * 0.5)),
      );

      for (let i = 0; i < numLessons; i++) {
        const lesson = allLessons[i];

        const existing = await prisma.videoProgress.findUnique({
          where: {
            userId_lessonId: {
              userId: enrollment.userId,
              lessonId: lesson.id,
            },
          },
        });

        if (existing) continue;

        // Progress entre 20 et 100% (plus réaliste)
        const progressPercent = 20 + Math.random() * 80;
        const duration = lesson.duration || 300;
        const currentTime = (duration * progressPercent) / 100;
        const isCompleted = progressPercent >= 90;

        // Activité RÉCENTE (0-7 jours pour 80% des progress)
        const random = Math.random();
        const daysAgo =
          random < 0.8
            ? Math.floor(Math.random() * 7) // 80% dans les 7 derniers jours
            : Math.floor(Math.random() * 14); // 20% dans les 8-14 derniers jours

        const activityDate = new Date(now);
        activityDate.setDate(activityDate.getDate() - daysAgo);

        await prisma.videoProgress.create({
          data: {
            userId: enrollment.userId,
            lessonId: lesson.id,
            currentTime,
            duration,
            progressPercent,
            isCompleted,
            lastWatchedAt: activityDate,
            completedAt: isCompleted ? activityDate : null,
          },
        });

        progressCount++;
      }
    }
  }

  console.log(`✅ ${progressCount} progressions vidéo créées\n`);

  // 5. Résumé avec répartition
  console.log('📊 RÉSUMÉ');
  console.log('='.repeat(50));
  console.log(`Instructeur: ${instructor.name}`);
  console.log(`Cours: ${courses.length}`);
  console.log(`Étudiants: ${students.length}`);
  console.log(`Enrollments: ${enrollmentCount}`);
  console.log(`Progressions vidéo: ${progressCount}`);
  console.log('');
  console.log('📈 DISTRIBUTION:');
  console.log('  - 70% des enrollments dans les 7 derniers jours');
  console.log('  - 80% des activités dans les 7 derniers jours');
  console.log('='.repeat(50));
  console.log('\n✅ Seed terminé! Regarde les 7 et 30 derniers jours 🎉\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
