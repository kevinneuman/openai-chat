import { useEffect, useState } from 'react'
import { useChatStore } from '@/zustand/chats'
import { useModelStore } from '@/zustand/models'
import { useSettingsStore } from '@/zustand/settings'

export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  // Get the stores to trigger hydration
  const chats = useChatStore((state) => state.chats)
  const models = useModelStore((state) => state.models)
  const settings = useSettingsStore((state) => state.role)

  useEffect(() => {
    // Wait for stores to hydrate
    const timer = setTimeout(() => {
      setIsHydrated(true)
    }, 0)

    return () => clearTimeout(timer)
  }, [chats, models, settings])

  return isHydrated
}
