// prisma/seed-messages.ts
// Créer une conversation + messages entre TON Instructor et TON Student

import { MessageStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Créer conversation + messages...\n');

  try {
    // ✅ IDS DES USERS RÉELS
    const instructorId = 'cbe3ab3c-743d-4be6-a7c7-dbd4235d6403'; // anique gérald
    const studentId = '90629126-d733-40f2-a702-541e9d981505'; // Pierre Gérald Louisin

    // ✅ ÉTAPE 1: Créer la CONVERSATION
    console.log('💬 Créer conversation...');
    const conversation = await prisma.conversation.upsert({
      where: {
        instructorId_studentId_courseId: {
          instructorId,
          studentId,
          courseId: '',
        },
      },
      update: {
        lastMessageAt: new Date(),
      },
      create: {
        instructorId,
        studentId,
        courseId: null, // Pas liée à un cours
        lastMessageAt: new Date(),
      },
    });
    console.log(`✅ Conversation créée (ID: ${conversation.id})\n`);

    // ✅ ÉTAPE 2: Créer des MESSAGES
    console.log('📨 Créer messages...\n');

    const messages = [
      {
        senderId: studentId,
        content:
          "Bonjour! Je débute avec NestJS et GraphQL. Est-ce que c'est compliqué?",
        status: MessageStatus.READ,
      },
      {
        senderId: instructorId,
        content:
          "Salut Pierre! 👋 Bienvenue! NestJS + GraphQL c'est puissant mais pas difficile. On commence par les bases, d'accord?",
        status: MessageStatus.READ,
      },
      {
        senderId: studentId,
        content: "Oui! Quelle est la meilleure façon d'apprendre?",
        status: MessageStatus.READ,
      },
      {
        senderId: instructorId,
        content: `Excellente question! Voici mon approche:

1️⃣ Comprendre les CONCEPTS
   - Query vs Mutation
   - Resolver vs Service
   - Types GraphQL

2️⃣ CODER des exemples
   - Petit projet simple
   - Ajouter fonctionnalités progressivement

3️⃣ TESTER et DÉBOGUER
   - GraphQL Playground
   - Logs et console
   - Tests unitaires

4️⃣ ITÉRER et AMÉLIORER
   - Code review
   - Performance
   - Security

Tu es prêt à commencer? 🚀`,
        status: MessageStatus.SENT, // Non lu par Pierre
      },
    ];

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const createdMsg = await prisma.message.create({
        data: {
          content: msg.content,
          senderId: msg.senderId,
          conversationId: conversation.id,
          status: msg.status,
          readAt:
            msg.status === MessageStatus.READ
              ? new Date(Date.now() - 1000 * 60 * (i + 1))
              : null,
        },
      });
      console.log(`   ✅ Message ${i + 1} créé`);
    }

    console.log('\n═══════════════════════════════════════════');
    console.log('✅ SEED COMPLÈTE!\n');
    console.log('📊 Créé:');
    console.log(`   💬 1 Conversation`);
    console.log(`   📨 ${messages.length} Messages\n`);
    console.log('👉 Va sur: http://localhost:3000/instructor/messages');
    console.log('   Tu devrais voir la conversation!\n');
    console.log('═══════════════════════════════════════════');
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
