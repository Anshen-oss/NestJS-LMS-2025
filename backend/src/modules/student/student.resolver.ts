import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ClerkGqlGuard } from '../auth/guards/clerk-gql.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  ConversationDetailOutput,
  ConversationListResponseOutput,
  SendMessageOutput,
} from '../instructor/dto/messages.dto';
import { User } from '../users/entities/user.entity';
import { StudentService } from './student.service';

@Resolver()
@UseGuards(ClerkGqlGuard, RolesGuard)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  // ═══════════════════════════════════════════════════════════
  //                     QUERIES
  // ═══════════════════════════════════════════════════════════

  /**
   * 📋 Récupère les conversations de l'étudiant connecté
   *
   * Accès: STUDENT, ADMIN (pour see ses propres conversations)
   *
   * @param page - Numéro de page (défaut: 1)
   * @param pageSize - Résultats par page (défaut: 10)
   * @param courseId - (Optionnel) Filtrer par cours
   * @param search - (Optionnel) Rechercher par nom d'instructor
   */
  @Query(() => ConversationListResponseOutput, {
    name: 'studentConversations',
    description: "Liste des conversations de l'étudiant connecté",
  })
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  async getStudentConversations(
    @CurrentUser() user: User,
    @Args('page', { type: () => Int, defaultValue: 1, nullable: true })
    page: number = 1,
    @Args('pageSize', { type: () => Int, defaultValue: 10, nullable: true })
    pageSize: number = 10,
    @Args('courseId', { nullable: true })
    courseId?: string,
    @Args('search', { nullable: true })
    search?: string,
  ): Promise<ConversationListResponseOutput> {
    console.log('📋 Query: studentConversations');
    console.log('👤 User ID:', user.id);

    return this.studentService.getStudentConversations(
      user.id,
      courseId,
      page,
      pageSize,
      search,
    );
  }

  /**
   * 💬 Récupère les détails d'une conversation spécifique
   *
   * Accès: STUDENT (si c'est sa conversation), ADMIN
   *
   * @param conversationId - ID de la conversation
   * @param limit - Nombre max de messages (défaut: 50, max: 100)
   */
  @Query(() => ConversationDetailOutput, {
    name: 'studentConversationDetail',
    description: "Détails complets d'une conversation avec tous les messages",
  })
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  async getConversationDetail(
    @CurrentUser() user: User,
    @Args('conversationId') conversationId: string,
    @Args('limit', { type: () => Int, defaultValue: 50, nullable: true })
    limit: number = 50,
  ): Promise<ConversationDetailOutput> {
    console.log('💬 Query: studentConversationDetail');
    console.log('👤 User ID:', user.id);
    console.log('🆔 Conversation ID:', conversationId);

    return this.studentService.getConversationDetail(
      user.id,
      conversationId,
      limit,
    );
  }

  // ═══════════════════════════════════════════════════════════
  //                     MUTATIONS
  // ═══════════════════════════════════════════════════════════

  /**
   * ✉️ Envoie un message à l'instructor
   *
   * Accès: STUDENT, ADMIN
   *
   * @param instructorId - ID de l'instructor (recipient)
   * @param content - Contenu du message
   * @param courseId - (Optionnel) Contexte (ID du cours)
   */
  @Mutation(() => SendMessageOutput, {
    name: 'studentSendMessage',
    description: "Envoie un message à l'instructor du cours",
  })
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  async sendMessage(
    @CurrentUser() user: User,
    @Args('instructorId') instructorId: string,
    @Args('content') content: string,
    @Args('courseId', { nullable: true }) courseId?: string,
  ): Promise<SendMessageOutput> {
    console.log('✉️ Mutation: studentSendMessage');
    console.log('👤 Student ID:', user.id);
    console.log('👨‍🏫 Instructor ID:', instructorId);
    console.log('📚 Course ID:', courseId || 'N/A');

    return this.studentService.sendMessage(
      user.id,
      instructorId,
      content,
      courseId,
    );
  }
}
