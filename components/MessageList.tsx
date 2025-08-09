'use client'

import { useEffect, useState } from 'react'
import { supabase, type Message } from '@/lib/supabase/client'

const MESSAGES_PER_PAGE = 20

export default function MessageList() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMessages = async (fromId?: number) => {
    try {
      let query = supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true }) // Changed to ascending for chronological order
        .limit(MESSAGES_PER_PAGE)

      if (fromId) {
        query = query.gt('id', fromId) // Changed to gt for loading more recent messages
      }

      const { data, error } = await query

      if (error) {
        console.error('Error loading messages:', error)
        return
      }

      if (data) {
        if (fromId) {
          // Loading more recent messages
          setMessages(prev => [...prev, ...data])
        } else {
          // Initial load
          setMessages(data)
        }
        
        setHasMore(data.length === MESSAGES_PER_PAGE)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (messages.length > 0) {
      setLoadingMore(true)
      const lastMessageId = messages[messages.length - 1].id
      loadMessages(lastMessageId)
    }
  }

  useEffect(() => {
    loadMessages()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new as Message
          setMessages(prev => [...prev, newMessage]) // Add new message at the end
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'À l\'instant'
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`
    return `Il y a ${Math.floor(diffInSeconds / 86400)}j`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="flex flex-col">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 max-w-4xl hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-green-400 text-sm font-mono">
                &gt; {message.nickname}
              </span>
              <span className="text-xs text-gray-500 font-mono">
                [{formatDate(message.created_at)}]
              </span>
            </div>
            <div className="bg-gray-900 rounded p-3 border-l-4 border-green-500">
              <p className="text-gray-100 text-sm leading-relaxed font-mono whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {hasMore && (
        <div className="text-center py-4">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-green-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-mono border border-gray-700"
          >
            {loadingMore ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                <span>Chargement...</span>
              </div>
            ) : (
              '&gt; Charger plus'
            )}
          </button>
        </div>
      )}
      
      {!hasMore && messages.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-xs font-mono">
          &gt; Tous les messages ont été chargés
        </div>
      )}

      {messages.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p className="font-mono">&gt; Aucun message pour le moment</p>
          <p className="text-sm font-mono text-gray-600">{'// Soyez le premier à envoyer un message !'}</p>
        </div>
      )}
    </div>
  )
}
