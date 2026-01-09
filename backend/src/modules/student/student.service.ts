import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ConversationDetailOutput,
  ConversationListResponseOutput,
  MessageOutput,
  MessageStatusEnum,
  SendMessageOutput,
} from '../instructor/dto/messages.dto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  /**
   * 📋 Récupère les conversations de l'étudiant (avec un instructor spécifique ou tous)
   *
   * @param studentId - ID de l'étudiant connecté
   * @param courseId - (Optionnel) Filtrer par cours
   * @param page - Numéro de page
   * @param pageSize - Résultats par page
   * @param search - (Optionnel) Rechercher par nom d'instructor
   */
  async getStudentConversations(
    studentId: string,
    courseId?: string,
    page: number = 1,
    pageSize: number = 10,
    search?: string,
  ): Promise<ConversationListResponseOutput> {
    console.log('📋 Getting student conversations');
    console.log('👤 Student ID:', studentId);
    console.log('📚 Course ID:', courseId || 'all');

    // 1️⃣ Construire les filtres
    const where = {
      studentId,
      ...(courseId && { courseId }),
    };

    // 2️⃣ Compter le total (pour la pagination)
    const total = await this.prisma.conversation.count({ where });

    // 3️⃣ Récupérer les conversations
    const conversations = await this.prisma.conversation.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        messages: {
          select: {
            content: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1, // Juste le dernier message
        },
      },
      orderBy: { lastMessageAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // 4️⃣ Mapper au DTO
    const conversationList = conversations.map((conv) => {
      const lastMsg = conv.messages[0];
      return {
        id: conv.id,
        participantId: conv.instructorId,
        participantName: conv.instructor.name,
        participantImage: conv.instructor.image,
        participantEmail: conv.instructor.email,
        lastMessage: lastMsg?.content || null,
        lastMessageAt: lastMsg?.createdAt || null,
        unreadCount: 0, // TODO: Implémenter la logique unread
        courseId: conv.course?.id || null,
        courseTitle: conv.course?.title || null,
      };
    });

    console.log(`✅ Found ${total} conversations`);

    return {
      conversations: conversationList,
      total,
      page,
      pageSize,
    };
  }

  /**
   * 💬 Récupère les détails d'une conversation (avec tous les messages)
   *
   * @param studentId - ID de l'étudiant (pour vérification)
   * @param conversationId - ID de la conversation
   * @param limit - Nombre max de messages à retourner
   */
  async getConversationDetail(
    studentId: string,
    conversationId: string,
    limit: number = 50,
  ): Promise<ConversationDetailOutput> {
    console.log('💬 Getting conversation detail');
    console.log('👤 Student ID:', studentId);
    console.log('🆔 Conversation ID:', conversationId);

    // Limiter à 100 max
    const safeLimit = Math.min(Math.max(1, limit), 100);

    // 1️⃣ Récupérer la conversation
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
          take: safeLimit,
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation not found: ${conversationId}`);
    }

    // 2️⃣ Vérifier que c'est bien la conversation de l'étudiant
    if (conversation.studentId !== studentId) {
      throw new Error('Unauthorized: Not your conversation');
    }

    // 3️⃣ Mapper les messages au DTO
    const messageOutputs: MessageOutput[] = conversation.messages.map(
      (msg) => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        senderName: msg.sender.name,
        senderImage: msg.sender.image,
        status: msg.status as MessageStatusEnum,
        readAt: msg.readAt,
        createdAt: msg.createdAt,
      }),
    );

    const totalMessages = await this.prisma.message.count({
      where: { conversationId },
    });

    console.log(`✅ Found ${totalMessages} messages in conversation`);

    return {
      id: conversation.id,
      participantId: conversation.instructorId,
      participantName: conversation.instructor.name,
      participantImage: conversation.instructor.image,
      participantEmail: conversation.instructor.email,
      courseId: conversation.course?.id || null,
      courseTitle: conversation.course?.title || null,
      messages: messageOutputs,
      totalMessages,
      createdAt: conversation.createdAt,
    };
  }

  /**
   * ✉️ Envoie un message de l'étudiant à l'instructor
   *
   * @param studentId - ID de l'étudiant (sender)
   * @param instructorId - ID de l'instructor (recipient)
   * @param content - Contenu du message
   * @param courseId - ID du cours (contexte)
   */
  async sendMessage(
    studentId: string,
    instructorId: string,
    content: string,
    courseId?: string,
  ): Promise<SendMessageOutput> {
    try {
      console.log('✉️ Student sending message');
      console.log('👤 Student ID:', studentId);
      console.log('👨‍🏫 Instructor ID:', instructorId);

      // Validation
      if (!content || content.trim().length === 0) {
        return {
          success: false,
          message: null,
          error: 'Message content cannot be empty',
        };
      }

      if (content.length > 5000) {
        return {
          success: false,
          message: null,
          error: 'Message is too long (max 5000 characters)',
        };
      }

      // 1️⃣ Créer ou récupérer la conversation
      const conversation = await this.prisma.conversation.upsert({
        where: {
          instructorId_studentId_courseId: {
            instructorId,
            studentId,
            courseId: courseId || '', // 🆕 Défaut à string vide
          },
        },
        update: {
          lastMessageAt: new Date(),
          courseId: courseId || null, // 🆕 null dans update
        },
        create: {
          instructorId,
          studentId,
          courseId: courseId || null,
          lastMessageAt: new Date(),
        },
      });

      console.log('✅ Conversation upserted');

      // 2️⃣ Créer le message
      const message = await this.prisma.message.create({
        data: {
          content: content.trim(),
          senderId: studentId,
          conversationId: conversation.id,
          status: 'SENT',
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      console.log('✅ Message created');

      // 3️⃣ Mapper au DTO
      const messageOutput: MessageOutput = {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        senderName: message.sender.name,
        senderImage: message.sender.image,
        status: message.status as MessageStatusEnum,
        readAt: message.readAt,
        createdAt: message.createdAt,
      };

      return {
        success: true,
        message: messageOutput,
        error: null,
      };
    } catch (error) {
      console.error('❌ Error sending message:', error);
      return {
        success: false,
        message: null,
        error: 'Failed to send message',
      };
    }
  }
}
