'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { NicknameModal } from './NicknameModal'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'

const fetcher = (url) => fetch(url).then((res) => res.json())

export function PagesIndexJs() {
  const [nickname, setNickname] = useState('')
  const [showModal, setShowModal] = useState(true)

  const { data, mutate } = useSWR('/api/messages', fetcher, {
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
        body: JSON.stringify({ type: 'message', data: newMessage }),
      })
      mutate()
    }
  }

  const updateTypingStatus = useCallback(async (isTyping) => {
    await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'typing', data: { nickname, isTyping } }),
    })
    mutate()
  }, [nickname, mutate])

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
        {data && (
          <>
            <ChatMessages messages={data.messages} currentUser={nickname} typingUsers={data.typingUsers} />
            <ChatInput onSendMessage={sendMessage} onTyping={updateTypingStatus} connected={true} />
          </>
        )}
      </div>
    </div>
  )
}