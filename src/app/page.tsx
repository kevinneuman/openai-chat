'use client'

import { ToastContainer } from 'react-toastify'
import Chat from '@/components/Chat'
import DesktopMenu from '@/components/DesktopMenu'
import MobileMenu from '@/components/MobileMenu'
import { useChatStore } from '@/zustand/chats'
import useStore from '@/zustand/useStore'
import 'react-toastify/dist/ReactToastify.css'

export default function Home() {
  const chats = useStore(useChatStore, (state) => state.chats)

  if (!chats?.length) {
    return null
  }

  return (
    <main className="bg-neutral-950">
      <ToastContainer />
      <div className="flex max-md:flex-col gap-2 h-screen m-auto">
        <MobileMenu />
        <DesktopMenu />
        <Chat />
      </div>
    </main>
  )
}
