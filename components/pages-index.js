'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { NicknameModal } from './NicknameModal'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { ConnectionStatus } from './ConnectionStatus'

const fetcher = (url) => fetch(url).then((res) => res.json())

export function PagesIndexJs() {
  const [nickname, setNickname] = useState('')
  const [showModal, setShowModal] = useState(true)

  const { data: messages, error, mutate } = useSWR('/api/messages', fetcher, {
    refreshInterval: 1000,
    revalidateOnFocus: false,
    dedupingInterval: 1000
  })

  const sendMessage = async (message) => {
    if (message && nickname) {
      const newMessage = {
        text: message,
        nickname,
        timestamp: new Date().toISOString(),
      }
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      })
      // Optimistic update
      mutate((currentMessages) => [...currentMessages, newMessage], false)
      // Revalidate
      mutate()
    }
  }

  const handleNicknameSubmit = (userNickname) => {
    setNickname(userNickname)
    setShowModal(false)
  }

  const handleLogout = () => {
    setNickname('')
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
        {error && <div>Failed to load messages</div>}
        {!messages && <div>Loading...</div>}
        {messages && <ChatMessages messages={messages} currentUser={nickname} />}
        <ChatInput onSendMessage={sendMessage} connected={!!messages} />
        <ConnectionStatus connected={!!messages} />
      </div>
    </div>
  )
}