'use client'

import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { NicknameModal } from './NicknameModal'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { ConnectionStatus } from './ConnectionStatus'

let socket

export function PagesIndexJs() {
  const [messages, setMessages] = useState([])
  const [connected, setConnected] = useState(false)
  const [nickname, setNickname] = useState('')
  const [showModal, setShowModal] = useState(true)
  const [typingUsers, setTypingUsers] = useState([])

  useEffect(() => {
    if (nickname) {
      socketInitializer()
    }
    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [nickname])

  const socketInitializer = async () => {
    await fetch('/api/socket');
    
    socket = io({
      path: '/api/socketio',
    });

    socket.on('connect', () => {
      console.log('Connected to server')
      setConnected(true)
    })

    socket.on('receive-message', (msg) => {
      console.log('Received message:', msg)
      setMessages((prevMessages) => [...prevMessages, msg])
    })

    socket.on('user-typing', ({ nickname, isTyping }) => {
      console.log(`Received typing event: ${nickname} is ${isTyping ? 'typing' : 'not typing'}`);
      setTypingUsers(prev => {
        const newTypingUsers = isTyping
          ? [...new Set([...prev, nickname])]
          : prev.filter(user => user !== nickname);
        console.log('Updated typing users:', newTypingUsers);
        return newTypingUsers;
      })
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from server')
      setConnected(false)
    })

    socket.on('connect_error', (err) => {
      console.log('Connection error:', err)
      setConnected(false)
    })
  }

  const sendMessage = (message) => {
    if (message && connected) {
      const newMessage = {
        text: message,
        nickname,
        timestamp: new Date().toISOString(),
      }
      console.log('Sending message:', newMessage)
      socket.emit('send-message', newMessage)
      socket.emit('user-typing', { nickname, isTyping: false })
    }
  }

  const handleTyping = (isTyping) => {
    console.log(`Emitting typing event: ${nickname} is ${isTyping ? 'typing' : 'not typing'}`);
    socket.emit('user-typing', { nickname, isTyping })
  }

  const handleNicknameSubmit = (userNickname) => {
    setNickname(userNickname)
    setShowModal(false)
  }

  const handleLogout = () => {
    if (socket) {
      socket.disconnect()
    }
    setNickname('')
    setMessages([])
    setConnected(false)
    setShowModal(true)
  }

  if (showModal) {
    return <NicknameModal isOpen={showModal} onSubmit={handleNicknameSubmit} />
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Log out
        </button>
      </header>
      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatMessages messages={messages} currentUser={nickname} typingUsers={typingUsers} />
        <ChatInput onSendMessage={sendMessage} connected={connected} onTyping={handleTyping} />
        <ConnectionStatus connected={connected} />
      </div>
    </div>
  )
}