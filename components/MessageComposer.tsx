'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

const MAX_CONTENT_LENGTH = 300

export default function MessageComposer() {
  const [content, setContent] = useState('')
  const [nickname, setNickname] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Load nickname from localStorage on component mount
  useEffect(() => {
    const savedNickname = localStorage.getItem('chat-nickname')
    if (savedNickname) {
      setNickname(savedNickname)
    }
  }, [])

  // Save nickname to localStorage when it changes
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value
    setNickname(newNickname)
    localStorage.setItem('chat-nickname', newNickname)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await sendMessage()
  }

  const sendMessage = async () => {
    const trimmedContent = content.trim()
    const trimmedNickname = nickname.trim() || 'Anonyme'
    
    // Validation
    if (!trimmedContent) {
      setError('Le message ne peut pas être vide')
      return
    }
    
    if (trimmedContent.length > MAX_CONTENT_LENGTH) {
      setError(`Le message ne peut pas dépasser ${MAX_CONTENT_LENGTH} caractères`)
      return
    }
    
    setError('')
    setIsSubmitting(true)
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: trimmedContent,
          nickname: trimmedNickname
        })
      
      if (error) {
        console.error('Error sending message:', error)
        setError('Erreur lors de l\'envoi du message')
        return
      }
      
      // Clear only content on success, keep nickname
      setContent('')
      
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Erreur lors de l\'envoi du message')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const remainingChars = MAX_CONTENT_LENGTH - content.length
  const isOverLimit = remainingChars < 0

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={nickname}
          onChange={handleNicknameChange}
          placeholder="Votre pseudo (optionnel)"
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm text-gray-100 placeholder-gray-500 font-mono"
          maxLength={30}
        />
      </div>
      
      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tapez votre message... (Entrée pour envoyer, Shift+Entrée pour nouvelle ligne)"
          rows={2}
          className={`flex-1 px-3 py-2 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none text-sm text-gray-100 placeholder-gray-500 font-mono ${
            isOverLimit ? 'border-red-500' : 'border-gray-700'
          }`}
          maxLength={MAX_CONTENT_LENGTH}
        />
        <button
          type="submit"
          disabled={isSubmitting || !content.trim() || isOverLimit}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-colors text-sm font-mono border border-green-500"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-1">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              <span>Envoi</span>
            </div>
          ) : (
            '> Envoyer'
          )}
        </button>
      </div>
      
      <div className="flex justify-between items-center">
        <span className={`text-xs font-mono ${isOverLimit ? 'text-red-400' : 'text-gray-500'}`}>
          {'>'} {remainingChars} caractères restants
        </span>
        {error && (
          <span className="text-red-400 text-xs font-mono">{'>'} {error}</span>
        )}
      </div>
    </form>
  )
}
