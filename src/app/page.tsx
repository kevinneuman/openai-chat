'use client'

import AppLoading from '@/components/AppLoading'
import Chat from '@/components/Chat'
import DesktopMenu from '@/components/DesktopMenu'
import MobileMenu from '@/components/MobileMenu'
import { useHydration } from '@/hooks/useHydration'
import { useChatStore } from '@/zustand/chats'

export default function Home() {
  const isHydrated = useHydration()
  const chats = useChatStore((state) => state.chats)

  if (!isHydrated) {
    return <AppLoading />
  }

  if (!chats.length) {
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
