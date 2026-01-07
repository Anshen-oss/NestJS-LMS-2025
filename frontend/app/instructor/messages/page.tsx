'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import {
  useConversationDetail,
  useInstructorConversations,
  useMarkConversationAsRead,
  useMessagesStats,
  useSendMessage,
} from '@/hooks/use-instructor-messages'
import { MessageCircle, Search, Send } from 'lucide-react'
import { useState } from 'react'

export default function MessagesPage() {
  // State
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [page, setPage] = useState(1)

  // Hooks
  const { conversations, total, hasNextPage, hasPreviousPage, loading, error } =
    useInstructorConversations(page, 10, debouncedSearch)

  const { conversation, loading: loadingDetail } = useConversationDetail(
    selectedConversationId || '',
  )

  const { stats } = useMessagesStats()

  const { send, loading: sendingMessage } = useSendMessage()

  const { markAsRead } = useMarkConversationAsRead()

  // Debounce search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    // Simple debounce (pas de dépendance sur useEffect)
    setTimeout(() => {
      setDebouncedSearch(value)
      setPage(1) // Reset pagination
    }, 300)
  }

  // Handle send message
  const handleSendMessage = async () => {
    if (!selectedConversationId || !conversation || !messageContent.trim()) {
      return
    }

    const success = await send(conversation.participantId, messageContent)

    if (success) {
      setMessageContent('')
    }
  }

  // Select conversation
  const handleSelectConversation = async (conversationId: string) => {
    setSelectedConversationId(conversationId)

    // Mark as read
    const conv = conversations.find((c) => c.id === conversationId)
    if (conv && conv.unreadCount > 0) {
      await markAsRead(conversationId)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-1">
                Discutez avec vos étudiants
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.totalConversations}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  Non lues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.totalUnreadMessages}
                </div>
                <p className="text-xs text-white mt-1">
                  {stats.unreadConversations} conversations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  Dernier message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-white">
                  {stats.lastMessageReceivedAt
                    ? new Date(stats.lastMessageReceivedAt).toLocaleDateString('fr-FR')
                    : 'Aucun message'}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List (Left) */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">Conversations</CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 px-6">
                {/* Search */}
                <div className="mb-4 relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-white" />
                  <Input
                    placeholder="Chercher..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>

                {/* List */}
                <ScrollArea className="flex-1 -mx-6 px-6">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">
                      Chargement...
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-red-500">
                      Erreur lors du chargement
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-2 text-white" />
                      <p>Aucune conversation</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {conversations.map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => handleSelectConversation(conv.id)}
                          className={`w-full text-left p-3 rounded-lg transition ${
                            selectedConversationId === conv.id
                              ? 'bg-blue-50 border border-blue-200'
                              : 'hover:bg-gray-100 border border-transparent'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-900">
                                {conv.participantName}
                              </div>
                              <p className="text-xs text-white truncate">
                                {conv.lastMessage || 'Pas de messages'}
                              </p>
                              {conv.courseTitle && (
                                <p className="text-xs text-blue-600 mt-1">
                                  {conv.courseTitle}
                                </p>
                              )}
                            </div>

                            {/* Unread Badge */}
                            {conv.unreadCount > 0 && (
                              <div className="flex-shrink-0 h-5 w-5 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {conv.unreadCount}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {/* Pagination */}
                {total > 10 && (
                  <div className="flex gap-2 mt-4 -mx-6 px-6 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!hasPreviousPage}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!hasNextPage}
                      onClick={() => setPage(p => p + 1)}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Conversation Detail (Right) */}
          <div className="lg:col-span-2">
            {!selectedConversationId ? (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500">Sélectionnez une conversation</p>
                </div>
              </Card>
            ) : loadingDetail ? (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-gray-500">Chargement...</div>
              </Card>
            ) : conversation ? (
              <Card className="h-[600px] flex flex-col">
                {/* Header */}
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {conversation.participantName}
                      </CardTitle>
                      {conversation.courseTitle && (
                        <p className="text-xs text-gray-500 mt-1">
                          Cours: {conversation.courseTitle}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4">
                    {conversation.messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        Aucun message pour le moment
                      </div>
                    ) : (
                      conversation.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex gap-2 ${
                            msg.senderId === conversation.participantId
                              ? 'justify-start'
                              : 'justify-end'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.senderId === conversation.participantId
                                ? 'bg-gray-100 text-gray-900'
                                : 'bg-blue-600 text-white'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.senderId === conversation.participantId
                                  ? 'text-gray-500'
                                  : 'text-blue-100'
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                              {msg.status === 'READ' && ' ✓✓'}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <CardContent className="p-4 border-t space-y-2">
                  <Textarea
                    placeholder="Tapez votre message..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleSendMessage()
                      }
                    }}
                    className="resize-none"
                    rows={2}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={
                      !messageContent.trim() || sendingMessage
                    }
                    className="w-full gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {sendingMessage ? 'Envoi...' : 'Envoyer'}
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
