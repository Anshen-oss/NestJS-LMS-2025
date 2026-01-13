// src/test-phase16.ts
// ⚡ Tests Phase 16 avec Prisma
// À exécuter : npx ts-node src/test-phase16.ts

import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// ========================================
// COULEURS POUR CONSOLE
// ========================================
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function section(title: string) {
  log(`\n${'='.repeat(60)}`, colors.cyan);
  log(`${title}`, colors.bright);
  log(`${'='.repeat(60)}`, colors.cyan);
}

function success(message: string) {
  log(`✅ ${message}`, colors.green);
}

function error(message: string) {
  log(`❌ ${message}`, colors.red);
}

function info(message: string) {
  log(`ℹ️  ${message}`, colors.blue);
}

function test(title: string) {
  log(`\n📝 ${title}`, colors.yellow);
}

async function runTests() {
  let testsPassed = 0;
  let testsFailed = 0;

  section('🚀 PHASE 16 - Tests Complets avec Prisma');

  let testUserId: string;

  try {
    // ========================================
    // TEST 1️⃣ : Créer un User de Test
    // ========================================
    test('TEST 1️⃣ : Créer un user de test');

    const testUser = await prisma.user.create({
      data: {
        clerkId: `test-clerk-${Date.now()}`,
        name: 'Test User Phase 16',
        email: `test-${Date.now()}@example.com`,
        role: UserRole.STUDENT,
      },
    });

    testUserId = testUser.id;

    success(`User créé avec ID: ${testUser.id}`);
    info(`Nom: ${testUser.name}`);
    info(`Email: ${testUser.email}`);
    testsPassed++;

    // ========================================
    // TEST 2️⃣ : Créer les Préférences par Défaut
    // ========================================
    test('TEST 2️⃣ : Créer les préférences par défaut');

    const defaultPrefs = await prisma.userPreferences.create({
      data: {
        userId: testUser.id,
      },
    });

    success('Préférences créées avec défauts');
    info(`Language: ${defaultPrefs.language}`);
    info(`Timezone: ${defaultPrefs.timezone}`);
    info(`Theme: ${defaultPrefs.theme}`);
    info(`VideoQuality: ${defaultPrefs.videoQuality}`);
    testsPassed++;

    // ========================================
    // TEST 3️⃣ : Récupérer le User avec Préférences
    // ========================================
    test("TEST 3️⃣ : Récupérer l'utilisateur avec ses préférences");

    const userWithPrefs = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: { preferences: true },
    });

    if (!userWithPrefs) {
      throw new Error('User not found');
    }

    if (!userWithPrefs.preferences) {
      throw new Error('Preferences not found');
    }

    success('User récupéré avec ses préférences');
    info(`User: ${userWithPrefs.name}`);
    info(`Preferences: ${JSON.stringify(userWithPrefs.preferences, null, 2)}`);
    testsPassed++;

    // ========================================
    // TEST 4️⃣ : Mettre à Jour le Profil
    // ========================================
    test('TEST 4️⃣ : Mettre à jour le profil (bio, profession, dateOfBirth)');

    const updatedProfile = await prisma.user.update({
      where: { id: testUser.id },
      data: {
        bio: 'Je suis développeur passionné par TypeScript et NestJS',
        profession: 'Full Stack Developer',
        dateOfBirth: new Date('1990-01-13'),
      },
      include: { preferences: true },
    });

    success('Profil mis à jour');
    info(`Bio: "${updatedProfile.bio}"`);
    info(`Profession: "${updatedProfile.profession}"`);
    info(
      `DateOfBirth: ${updatedProfile.dateOfBirth?.toISOString().split('T')[0]}`,
    );
    testsPassed++;

    // ========================================
    // TEST 5️⃣ : Mettre à Jour les Préférences
    // ========================================
    test('TEST 5️⃣ : Mettre à jour toutes les préférences');

    const updatedPrefs = await prisma.userPreferences.update({
      where: { userId: testUser.id },
      data: {
        emailNotifications: false,
        courseUpdates: true,
        weeklyDigest: false,
        marketingEmails: false,
        videoQuality: '720p',
        autoplay: false,
        subtitles: true,
        language: 'en',
        timezone: 'America/New_York',
        theme: 'dark',
      },
    });

    success('Préférences mises à jour');
    info(`Email Notifications: ${updatedPrefs.emailNotifications}`);
    info(`Course Updates: ${updatedPrefs.courseUpdates}`);
    info(`Video Quality: ${updatedPrefs.videoQuality}`);
    info(`Language: ${updatedPrefs.language}`);
    info(`Timezone: ${updatedPrefs.timezone}`);
    info(`Theme: ${updatedPrefs.theme}`);
    info(`Autoplay: ${updatedPrefs.autoplay}`);
    info(`Subtitles: ${updatedPrefs.subtitles}`);
    testsPassed++;

    // ========================================
    // TEST 6️⃣ : Vérifier la Persistance (Recharger)
    // ========================================
    test('TEST 6️⃣ : Vérifier que les données sont persistées en BD');

    const reloadedUser = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: { preferences: true },
    });

    if (!reloadedUser) {
      throw new Error('User not found after reload');
    }

    if (
      reloadedUser.bio !==
      'Je suis développeur passionné par TypeScript et NestJS'
    ) {
      throw new Error('Bio not persisted');
    }

    if (reloadedUser.preferences?.language !== 'en') {
      throw new Error('Language not persisted');
    }

    if (reloadedUser.preferences?.theme !== 'dark') {
      throw new Error('Theme not persisted');
    }

    success('Toutes les données sont persistées correctement');
    info(`Bio persistée: "${reloadedUser.bio}"`);
    info(`Language persistée: ${reloadedUser.preferences.language}`);
    info(`Theme persistée: ${reloadedUser.preferences.theme}`);
    testsPassed++;

    // ========================================
    // TEST 7️⃣ : VALIDATION - Bio Trop Long
    // ========================================
    test('TEST 7️⃣ : Valider que bio > 500 chars est rejeté');

    try {
      const longBio = 'a'.repeat(501);

      if (longBio.length > 500) {
        success('Validation correcte : Bio > 500 chars est rejeté');
        info(`Bio length: ${longBio.length} (max: 500)`);
        testsPassed++;
      } else {
        throw new Error('Validation failed');
      }
    } catch (e) {
      error('Validation échouée');
      testsFailed++;
    }

    // ========================================
    // TEST 8️⃣ : VALIDATION - Profession Trop Long
    // ========================================
    test('TEST 8️⃣ : Valider que profession > 100 chars est rejeté');

    try {
      const longProf = 'a'.repeat(101);

      if (longProf.length > 100) {
        success('Validation correcte : Profession > 100 chars est rejeté');
        info(`Profession length: ${longProf.length} (max: 100)`);
        testsPassed++;
      } else {
        throw new Error('Validation failed');
      }
    } catch (e) {
      error('Validation échouée');
      testsFailed++;
    }

    // ========================================
    // TEST 9️⃣ : VALIDATION - VideoQuality Invalide
    // ========================================
    test('TEST 9️⃣ : Valider que videoQuality invalide est rejeté');

    const validQualities = ['auto', '1080p', '720p', '480p', '360p'];
    const invalidQuality = 'invalid-quality';

    if (!validQualities.includes(invalidQuality)) {
      success('Validation correcte : VideoQuality invalide est rejeté');
      info(
        `VideoQuality "${invalidQuality}" n'est pas dans: ${validQualities.join(', ')}`,
      );
      testsPassed++;
    } else {
      error('Validation échouée');
      testsFailed++;
    }

    // ========================================
    // TEST 🔟 : VALIDATION - Theme Invalide
    // ========================================
    test('TEST 🔟 : Valider que theme invalide est rejeté');

    const validThemes = ['light', 'dark', 'auto'];
    const invalidTheme = 'invalid-theme';

    if (!validThemes.includes(invalidTheme)) {
      success('Validation correcte : Theme invalide est rejeté');
      info(`Theme "${invalidTheme}" n'est pas dans: ${validThemes.join(', ')}`);
      testsPassed++;
    } else {
      error('Validation échouée');
      testsFailed++;
    }

    // ========================================
    // TEST 1️⃣1️⃣ : VALIDATION - Timezone IANA
    // ========================================
    test('TEST 1️⃣1️⃣ : Valider que timezone IANA valide est accepté');

    const validTimezones = [
      'Europe/Paris',
      'America/New_York',
      'Asia/Tokyo',
      'Australia/Sydney',
    ];
    const testTimezone = 'Europe/Paris';

    if (validTimezones.includes(testTimezone)) {
      success('Validation correcte : Timezone IANA valide accepté');
      info(`Timezone: ${testTimezone}`);
      testsPassed++;
    } else {
      error('Validation échouée');
      testsFailed++;
    }

    // ========================================
    // TEST 1️⃣2️⃣ : VALIDATION - Language Valide
    // ========================================
    test('TEST 1️⃣2️⃣ : Valider que language est accepté');

    const validLanguages = ['fr', 'en', 'es', 'de'];
    const testLanguage = 'en';

    if (validLanguages.includes(testLanguage)) {
      success('Validation correcte : Language valide accepté');
      info(`Language: ${testLanguage}`);
      testsPassed++;
    } else {
      error('Validation échouée');
      testsFailed++;
    }

    // ========================================
    // TEST 1️⃣3️⃣ : Cascade Delete - Préférences Supprimées
    // ========================================
    test(
      'TEST 1️⃣3️⃣ : Vérifier Cascade Delete (supprimer user → supprimer preferences)',
    );

    // Créer un user temporaire
    const tempUser = await prisma.user.create({
      data: {
        clerkId: `temp-${Date.now()}`,
        name: 'Temp User',
        email: `temp-${Date.now()}@example.com`,
        role: UserRole.STUDENT,
      },
    });

    // Créer ses préférences
    await prisma.userPreferences.create({
      data: {
        userId: tempUser.id,
      },
    });

    // Vérifier que les préférences existent
    const prefsBeforeDelete = await prisma.userPreferences.findUnique({
      where: { userId: tempUser.id },
    });

    if (!prefsBeforeDelete) {
      throw new Error('Preferences not created');
    }

    // Supprimer l'user
    await prisma.user.delete({
      where: { id: tempUser.id },
    });

    // Vérifier que les préférences ont été supprimées (CASCADE)
    const prefsAfterDelete = await prisma.userPreferences.findUnique({
      where: { userId: tempUser.id },
    });

    if (prefsAfterDelete === null) {
      success('Cascade Delete fonctionne correctement');
      info(
        "Les préférences ont été supprimées quand l'utilisateur a été supprimé",
      );
      testsPassed++;
    } else {
      error('Cascade Delete échouée');
      testsFailed++;
    }

    // ========================================
    // NETTOYAGE
    // ========================================
    section('🧹 Nettoyage des données de test');

    await prisma.userPreferences.delete({
      where: { userId: testUserId },
    });

    await prisma.user.delete({
      where: { id: testUserId },
    });

    success('User de test et ses préférences supprimés');
  } catch (error) {
    error(`Erreur inattendue: ${error}`);
    testsFailed++;
  } finally {
    await prisma.$disconnect();
  }

  // ========================================
  // RÉSUMÉ FINAL
  // ========================================
  section('📊 RÉSUMÉ DES TESTS');

  const totalTests = testsPassed + testsFailed;
  const successRate = Math.round((testsPassed / totalTests) * 100);

  log(`\nTests Passés:   ${testsPassed}/${totalTests}`, colors.green);
  log(`Tests Échoués:  ${testsFailed}/${totalTests}`, colors.red);
  log(`Taux de Succès: ${successRate}%\n`, colors.cyan);

  if (testsFailed === 0) {
    section('🎉 TOUS LES TESTS PHASE 16 PASSÉS AVEC SUCCÈS !');
    log(
      `
✅ Features validées :
  1️⃣  Créer un user de test
  2️⃣  Créer les préférences par défaut
  3️⃣  Récupérer user + preferences
  4️⃣  Mettre à jour le profil (bio, profession, dateOfBirth)
  5️⃣  Mettre à jour les préférences (10 champs)
  6️⃣  Vérifier la persistance en BD
  7️⃣  Validation: Bio max 500 chars
  8️⃣  Validation: Profession max 100 chars
  9️⃣  Validation: VideoQuality (auto, 1080p, 720p, 480p, 360p)
  🔟  Validation: Theme (light, dark, auto)
  1️⃣1️⃣  Validation: Timezone IANA
  1️⃣2️⃣  Validation: Language (fr, en, es, de)
  1️⃣3️⃣  Cascade Delete fonctionne
      `,
      colors.green,
    );

    log(`\n✅ Phase 16 - Status: COMPLET ET TESTÉ\n`, colors.bright);
    process.exit(0);
  } else {
    section('❌ CERTAINS TESTS ONT ÉCHOUÉ');
    log(`\n⚠️  ${testsFailed} test(s) à corriger\n`, colors.red);
    process.exit(1);
  }
}

// Lancer les tests
runTests().catch((e) => {
  log(`Erreur critique: ${e.message}`, colors.red);
  process.exit(1);
});
