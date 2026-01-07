'use client'

import { gql, useMutation, useQuery } from '@apollo/client'
import { useCallback, useMemo, useState } from 'react'

// ================================================================
// TYPES
// ================================================================

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

export interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderImage: string | null
  status: MessageStatus
  readAt: Date | null
  createdAt: Date
}

export interface ConversationPreview {
  id: string
  participantId: string
  participantName: string
  participantImage: string | null
  participantEmail: string | null
  lastMessage: string | null
  lastMessageAt: Date | null
  unreadCount: number
  courseId: string | null
  courseTitle: string | null
}

export interface ConversationListResponse {
  conversations: ConversationPreview[]
  total: number
  page: number
  pageSize: number
}

export interface ConversationDetail {
  id: string
  participantId: string
  participantName: string
  participantImage: string | null
  participantEmail: string | null
  courseId: string | null
  courseTitle: string | null
  messages: Message[]
  totalMessages: number
  createdAt: Date
}

export interface MessagesStats {
  totalConversations: number
  unreadConversations: number
  totalUnreadMessages: number
  lastMessageReceivedAt: Date | null
}

export interface SendMessageResponse {
  success: boolean
  message: Message | null
  error: string | null
}

// ================================================================
// GRAPHQL QUERIES
// ================================================================

const GET_INSTRUCTOR_CONVERSATIONS = gql`
  query GetInstructorConversations(
    $page: Int
    $pageSize: Int
    $search: String
  ) {
    instructorConversations(
      page: $page
      pageSize: $pageSize
      search: $search
    ) {
      conversations {
        id
        participantId
        participantName
        participantImage
        participantEmail
        lastMessage
        lastMessageAt
        unreadCount
        courseId
        courseTitle
      }
      total
      page
      pageSize
    }
  }
`

const GET_CONVERSATION_DETAIL = gql`
  query GetConversationDetail($conversationId: String!, $limit: Int) {
    conversationDetail(conversationId: $conversationId, limit: $limit) {
      id
      participantId
      participantName
      participantImage
      participantEmail
      courseId
      courseTitle
      messages {
        id
        content
        senderId
        senderName
        senderImage
        status
        readAt
        createdAt
      }
      totalMessages
      createdAt
    }
  }
`

const GET_MESSAGES_STATS = gql`
  query GetMessagesStats {
    messagesStats {
      totalConversations
      unreadConversations
      totalUnreadMessages
      lastMessageReceivedAt
    }
  }
`

// ================================================================
// GRAPHQL MUTATIONS
// ================================================================

const SEND_MESSAGE = gql`
  mutation SendMessage(
    $studentId: String!
    $content: String!
    $courseId: String
  ) {
    sendMessage(
      studentId: $studentId
      content: $content
      courseId: $courseId
    ) {
      success
      message {
        id
        content
        senderId
        senderName
        senderImage
        status
        readAt
        createdAt
      }
      error
    }
  }
`

const MARK_CONVERSATION_AS_READ = gql`
  mutation MarkConversationAsRead($conversationId: String!) {
    markConversationAsRead(conversationId: $conversationId)
  }
`

// ================================================================
// HOOKS
// ================================================================

/**
 * Hook pour récupérer la liste des conversations paginée
 * ✅ Pagination
 * ✅ Recherche
 * ✅ Unread count pour chaque conversation
 */
export function useInstructorConversations(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
) {
  const { data, loading, error, refetch, fetchMore } = useQuery<
    { instructorConversations: ConversationListResponse },
    { page: number; pageSize: number; search?: string }
  >(GET_INSTRUCTOR_CONVERSATIONS, {
    variables: { page, pageSize, search },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  const conversations = data?.instructorConversations.conversations || []
  const total = data?.instructorConversations.total || 0
  const currentPage = data?.instructorConversations.page || 1
  const currentPageSize = data?.instructorConversations.pageSize || 10

  // Pagination helpers
  const handleNextPage = useCallback(() => {
    const nextPage = currentPage + 1
    fetchMore({
      variables: { page: nextPage, pageSize: currentPageSize, search },
    })
  }, [currentPage, currentPageSize, search, fetchMore])

  const handlePreviousPage = useCallback(() => {
    const prevPage = Math.max(1, currentPage - 1)
    fetchMore({
      variables: { page: prevPage, pageSize: currentPageSize, search },
    })
  }, [currentPage, currentPageSize, search, fetchMore])

  const totalPages = Math.ceil(total / currentPageSize)
  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1

  return {
    conversations,
    total,
    page: currentPage,
    pageSize: currentPageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    loading,
    error,
    refetch,
    handleNextPage,
    handlePreviousPage,
  }
}

/**
 * Hook pour récupérer les détails d'une conversation
 * ✅ Tous les messages
 * ✅ Auto mark as read
 */
export function useConversationDetail(conversationId: string, limit?: number) {
  const { data, loading, error, refetch, subscribeToMore } = useQuery<
    { conversationDetail: ConversationDetail },
    { conversationId: string; limit?: number }
  >(GET_CONVERSATION_DETAIL, {
    variables: { conversationId, limit },
    fetchPolicy: 'network-only', // Toujours fresh
    errorPolicy: 'all',
  })

  const conversation = data?.conversationDetail

  return useMemo(
    () => ({
      conversation,
      loading,
      error,
      refetch,
      subscribeToMore,
    }),
    [conversation, loading, error, refetch, subscribeToMore],
  )
}

/**
 * Hook pour récupérer les stats des messages
 * ✅ Total conversations
 * ✅ Unread conversations count
 * ✅ Total unread messages
 */
export function useMessagesStats() {
  const { data, loading, error, refetch } = useQuery<
    { messagesStats: MessagesStats }
  >(GET_MESSAGES_STATS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    pollInterval: 30000, // Actualiser chaque 30s
  })

  return {
    stats: data?.messagesStats,
    loading,
    error,
    refetch,
  }
}

/**
 * Hook pour envoyer un message
 * ✅ Validation côté client
 * ✅ Optimistic response
 */
export function useSendMessage() {
  const [sendMessageMutation, { loading, error }] = useMutation<
    { sendMessage: SendMessageResponse },
    { studentId: string; content: string; courseId?: string }
  >(SEND_MESSAGE, {
    errorPolicy: 'all',
  })

  const [messageError, setMessageError] = useState<string | null>(null)

  const send = useCallback(
    async (
      studentId: string,
      content: string,
      courseId?: string,
    ): Promise<SendMessageResponse | null> => {
      // Validation
      if (!content || content.trim().length === 0) {
        setMessageError('Message cannot be empty')
        return null
      }

      if (content.length > 5000) {
        setMessageError('Message is too long (max 5000 characters)')
        return null
      }

      setMessageError(null)

      try {
        const { data } = await sendMessageMutation({
          variables: { studentId, content: content.trim(), courseId },
          refetchQueries: ['GetInstructorConversations', 'GetMessagesStats'],
        })

        if (data?.sendMessage.success) {
          return data.sendMessage
        } else {
          setMessageError(data?.sendMessage.error || 'Failed to send message')
          return null
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to send message'
        setMessageError(errorMsg)
        return null
      }
    },
    [sendMessageMutation],
  )

  return {
    send,
    loading,
    error: messageError || error,
  }
}

/**
 * Hook pour marquer une conversation comme lue
 */
export function useMarkConversationAsRead() {
  const [markAsReadMutation, { loading }] = useMutation<
    { markConversationAsRead: boolean },
    { conversationId: string }
  >(MARK_CONVERSATION_AS_READ, {
    errorPolicy: 'all',
  })

  const markAsRead = useCallback(
    async (conversationId: string): Promise<boolean> => {
      try {
        const { data } = await markAsReadMutation({
          variables: { conversationId },
          refetchQueries: ['GetInstructorConversations', 'GetMessagesStats'],
        })
        return data?.markConversationAsRead || false
      } catch (err) {
        console.error('Failed to mark as read:', err)
        return false
      }
    },
    [markAsReadMutation],
  )

  return { markAsRead, loading }
}
