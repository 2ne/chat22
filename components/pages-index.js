'use client'

import { useState, useCallback, useEffect } from 'react'
import useSWR from 'swr'
import { NicknameModal } from './NicknameModal'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'

const fetcher = (url) => fetch(url).then((res) => res.json())

export function PagesIndexJs() {
  const [nickname, setNickname] = useState('')
  const [showModal, setShowModal] = useState(true)

  const { data, error, mutate } = useSWR('/api/messages', fetcher, {
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
      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: 'message', data: newMessage }),
        })
        const updatedData = await response.json()
        mutate(updatedData, false) // Update the local data without revalidation
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    }
  }

  const updateTypingStatus = useCallback(async (isTyping) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'typing', data: { nickname, isTyping } }),
      })
      const updatedData = await response.json()
      mutate(updatedData, false) // Update the local data without revalidation
    } catch (error) {
      console.error('Failed to update typing status:', error)
    }
  }, [nickname, mutate])

  useEffect(() => {
    // Clear typing status when component unmounts
    return () => {
      updateTypingStatus(false)
    }
  }, [updateTypingStatus])

  const handleNicknameSubmit = (userNickname) => {
    setNickname(userNickname)
    setShowModal(false)
  }

  const handleLogout = () => {
    updateTypingStatus(false)
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
        {error && <div className="p-4 text-red-500">Failed to load messages</div>}
        {data && (
          <>
            <ChatMessages messages={data.messages} currentUser={nickname} typingUsers={data.typingUsers} />
            <ChatInput onSendMessage={sendMessage} onTyping={updateTypingStatus} connected={!error} />
          </>
        )}
      </div>
    </div>
  )
}