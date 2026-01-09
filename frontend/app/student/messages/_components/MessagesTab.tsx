'use client';

import { RenderDescription } from '@/components/rich-text-editor/RenderDescription';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send } from 'lucide-react';
import { useMemo, useState } from 'react';

// 🔑 IMPORTS CORRECTS
import {
  useStudentConversationDetailQuery,
  useStudentConversationsQuery,
  useStudentSendMessageMutation,
} from '@/lib/generated/graphql';

interface MessagesTabProps {
  courseId: string;
  instructorId: string;
}

export function MessagesTab({
  courseId,
  instructorId,
}: MessagesTabProps) {
  const [messageContent, setMessageContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  // 1️⃣ Récupérer les conversations pour ce cours
  const { data: conversationsData, loading: convLoading, refetch: refetchConversations } = useStudentConversationsQuery({
    variables: {
      page: 1,
      pageSize: 100,
      courseId,
    },
  });

  // 2️⃣ Extraire la conversationId depuis les conversations
  const conversations = conversationsData?.studentConversations?.conversations || [];
  const currentConversation = conversations.find(
    (conv: any) => conv.participantId === instructorId && conv.courseId === courseId
  );

  // Quand on trouve la conversation, mettre à jour l'état
  useMemo(() => {
    if (currentConversation?.id && !conversationId) {
      setConversationId(currentConversation.id);
    }
  }, [currentConversation, conversationId]);

  // 3️⃣ Récupérer les messages de la conversation (seulement si on a l'ID)
  const { data: detailData, loading: msgLoading, error, refetch: refetchMessages } = useStudentConversationDetailQuery({
    variables: {
      conversationId: conversationId || '',
    },
    skip: !conversationId,
  });

  // 4️⃣ Mutation: Envoyer un message
  const [sendMessage] = useStudentSendMessageMutation({
    onCompleted: async () => {
      setMessageContent('');
      await refetchMessages();
      await refetchConversations();
    },
  });

  // 5️⃣ Gérer l'envoi de message
  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    console.log('📤 SENDING MESSAGE:');
    console.log('instructorId:', instructorId);
    console.log('courseId:', courseId);
    console.log('content:', messageContent);

    setIsLoading(true);
    try {
      await sendMessage({
        variables: {
          instructorId,
          content: messageContent,
          courseId,
        },
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // const messages = useMemo(() => detailData?.studentConversationDetail?.messages || [], [detailData]);
const messages = useMemo(() => {
  const msgs = detailData?.studentConversationDetail?.messages || [];
  console.log('📩 Messages received:');
  console.log('Count:', msgs.length);
  console.log('Messages:', msgs.map((m: any) => ({
    id: m.id,
    content: m.content.substring(0, 50),
    senderId: m.senderId,
  })));
  return msgs;
}, [detailData]);

  const loading = convLoading || msgLoading;

  // 🆕 Fonction pour parser le contenu du message
  const renderMessageContent = (msg: any) => {
    // Vérifier si c'est du JSON (message d'accueil)
    if (msg.content && msg.content.startsWith('{')) {
      try {
        const json = JSON.parse(msg.content);
        return (
          <div className="prose prose-sm max-w-none text-black">
            <RenderDescription json={json} />
          </div>
        );
      } catch (e) {
        // Si parsing échoue, afficher comme plain text
        return <p className="text-sm mt-1 whitespace-pre-wrap">{msg.content}</p>;
      }
    }

    // Plain text normal
    return <p className="text-sm mt-1 whitespace-pre-wrap">{msg.content}</p>;
  };

  // 📍 UI
  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-green-600" />
        <h3 className="font-semibold text-lg">Messages</h3>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 border rounded-lg p-4 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Chargement des messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <MessageCircle className="w-8 h-8 text-gray-300" />
            <p className="text-gray-500">Aucun message pour le moment</p>
            <p className="text-sm text-gray-400">
              Envoie un message à l'instructeur
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg: any) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.senderId === instructorId ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                {msg.senderImage ? (
                  <img
                    src={msg.senderImage}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {msg.senderName?.[0] || 'U'}
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-2xl px-4 py-2 rounded-lg ${
                    msg.senderId === instructorId
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-gray-300 text-gray-900'
                  }`}
                >
                  <p className="text-sm font-semibold">{msg.senderName}</p>

                  {/* 🆕 Rendu intelligent du contenu */}
                  {renderMessageContent(msg)}

                  <p className="text-xs text-gray-600 mt-1">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleString('fr-FR') : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="flex gap-2">
        <Textarea
          placeholder="Écris un message à l'instructeur..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSendMessage();
            }
          }}
          rows={3}
          className="flex-1 text-black"
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || !messageContent.trim()}
          className="self-end"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Status */}
      {error && (
        <div className="text-red-600 text-sm">
          Erreur: {error.message}
        </div>
      )}
    </div>
  );
}
