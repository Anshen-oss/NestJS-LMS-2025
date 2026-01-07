import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

// ========================================
// ENUMS
// ========================================

export enum MessageStatusEnum {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

registerEnumType(MessageStatusEnum, { name: 'MessageStatus' });

// ========================================
// OBJECT TYPES (GraphQL Outputs)
// ========================================

/**
 * Représente un message unique
 * Utilisé dans le fil de discussion
 */
@ObjectType()
export class MessageOutput {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field()
  senderId: string;

  @Field()
  senderName: string;

  // ✅ FIX: Typage explicite pour les nullable types
  @Field(() => String, { nullable: true })
  senderImage: string | null;

  @Field(() => MessageStatusEnum)
  status: MessageStatusEnum;

  // ✅ FIX: Typage explicite pour les nullable types
  @Field(() => Date, { nullable: true })
  readAt: Date | null;

  @Field(() => Date)
  createdAt: Date;
}

/**
 * Représente une conversation (pour la liste)
 * Préview de la dernière conversation
 */
@ObjectType()
export class ConversationPreviewOutput {
  @Field()
  id: string;

  @Field()
  participantId: string; // L'autre personne (Student si on est Instructor)

  @Field()
  participantName: string;

  // ✅ FIX: Typage explicite pour les nullable types
  @Field(() => String, { nullable: true })
  participantImage: string | null;

  // ✅ FIX: Typage explicite pour les nullable types
  @Field(() => String, { nullable: true })
  participantEmail: string | null;

  // ✅ FIX: Typage explicite pour les nullable types
  @Field(() => String, { nullable: true })
  lastMessage: string | null; // Préview du dernier message

  // ✅ FIX: Typage explicite pour les nullable types
  @Field(() => Date, { nullable: true })
  lastMessageAt: Date | null;

  @Field(() => Int)
  unreadCount: number; // Nombre de messages non lus

  // ✅ FIX: Typage explicite pour les nullable types
  @Field(() => String, { nullable: true })
  courseId: string | null; // Contexte optionnel (cours)

  // ✅ FIX: Typage explicite pour les nullable types
  @Field(() => String, { nullable: true })
  courseTitle: string | null;
}

/**
 * Réponse paginée pour la liste des conversations
 */
@ObjectType()
export class ConversationListResponseOutput {
  @Field(() => [ConversationPreviewOutput])
  conversations: ConversationPreviewOutput[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;
}

/**
 * Représente un fil de discussion complet
 * Utilisé lors de l'ouverture d'une conversation
 */
@ObjectType()
export class ConversationDetailOutput {
  @Field()
  id: string;

  @Field()
  participantId: string;

  @Field()
  participantName: string;

  // ✅ FIX: Typage explicite pour les nullable types
  @Field(() => String, { nullable: true })
  participantImage: string | null;

  // ✅ FIX: Typage explicite pour les nullable types
  @Field(() => String, { nullable: true })
  participantEmail: string | null;

  // ✅ FIX: Typage explicite pour les nullable types
  @Field(() => String, { nullable: true })
  courseId: string | null;

  // ✅ FIX: Typage explicite pour les nullable types
  @Field(() => String, { nullable: true })
  courseTitle: string | null;

  @Field(() => [MessageOutput])
  messages: MessageOutput[];

  @Field(() => Int)
  totalMessages: number;

  @Field(() => Date)
  createdAt: Date;
}

/**
 * Réponse pour envoyer un message
 */
@ObjectType()
export class SendMessageOutput {
  @Field()
  success: boolean;

  // ✅ FIX: Typage explicite pour les nullable types
  @Field(() => MessageOutput, { nullable: true })
  message: MessageOutput | null;

  // ✅ FIX: Typage explicite pour les nullable types
  @Field(() => String, { nullable: true })
  error: string | null;
}

/**
 * Statistiques des messages pour l'instructeur
 */
@ObjectType()
export class MessagesStatsOutput {
  @Field(() => Int)
  totalConversations: number;

  @Field(() => Int)
  unreadConversations: number;

  @Field(() => Int)
  totalUnreadMessages: number;

  // ✅ FIX: Typage explicite pour les nullable types
  @Field(() => Date, { nullable: true })
  lastMessageReceivedAt: Date | null;
}
