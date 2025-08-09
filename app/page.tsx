import MessageList from '@/components/MessageList'
import MessageComposer from '@/components/MessageComposer'

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-green-400 font-mono">
            &gt; CHAT_PUBLIC.exe
          </h1>
          <p className="text-gray-400 text-sm font-mono">
            {'// Accès anonyme autorisé - Partagez vos messages avec le monde'}
          </p>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 bg-gray-900 rounded-lg border border-gray-800 p-4">
          <MessageList />
        </div>

        {/* Message Composer - Fixed at bottom */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
          <MessageComposer />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 px-4 py-2">
        <div className="max-w-4xl mx-auto text-center text-gray-500 text-xs font-mono">
          <p>&gt; Système: Chat public ultra simple - Aucune authentification requise</p>
        </div>
      </footer>
    </div>
  )
}
