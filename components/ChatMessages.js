import { useEffect, useRef } from 'react'

export function ChatMessages({ messages, currentUser, typingUsers }) {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  const formatFullDate = (date) => {
    return new Date(date).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, index) => {
        const isSentByCurrentUser = msg.nickname === currentUser
        const messageDate = new Date(msg.timestamp)
        return (
          <div
            key={index}
            className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-lg p-3 shadow ${
                isSentByCurrentUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-black'
              }`}
            >
              {!isSentByCurrentUser && (
                <div className="font-bold text-sm mb-1">{msg.nickname}</div>
              )}
              <div>{msg.text}</div>
              <div 
                className={`text-xs ${isSentByCurrentUser ? 'text-blue-200' : 'text-gray-500'} mt-1`}
                title={formatFullDate(messageDate)}
              >
                {formatTime(messageDate)}
              </div>
            </div>
          </div>
        )
      })}
      {typingUsers.length > 0 && typingUsers.filter(user => user !== currentUser).length > 0 && (
        <div className="text-sm text-gray-500 italic">
          {typingUsers.filter(user => user !== currentUser).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}