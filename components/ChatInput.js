import { useState, useEffect, useRef } from 'react'

export function ChatInput({ onSendMessage, onTyping, connected }) {
  const [message, setMessage] = useState('')
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      onTyping(false)
    }
  }, [onTyping])

  const handleInputChange = (e) => {
    setMessage(e.target.value)
    onTyping(true)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false)
    }, 2000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && connected) {
      onSendMessage(message)
      setMessage('')
      onTyping(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white">
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          disabled={!connected}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
          disabled={!connected}
        >
          Send
        </button>
      </div>
    </form>
  )
}