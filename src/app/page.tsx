'use client'

import Chat from '@/components/Chat'
import DesktopMenu from '@/components/DesktopMenu'
import MobileMenu from '@/components/MobileMenu'
import { useChatStore } from '@/zustand/chats'
import useStore from '@/zustand/useStore'

export default function Home() {
  const chats = useStore(useChatStore, (state) => state.chats)

  if (!chats?.length) {
    return null
  }

  return (
    <main className="bg-neutral-950">
      <div className="flex max-md:flex-col gap-2 h-screen m-auto">
        <MobileMenu />
        <DesktopMenu />
        <Chat />
      </div>
    </main>
  )
}
