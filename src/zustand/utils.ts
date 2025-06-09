import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UtilsState = {
  stopFunction: (() => void) | null
  setStopFunction: (stopFunc: () => void) => void
  clearStopFunction: () => void
}

export const useUtilsStore = create<UtilsState>()(
  persist(
    (set) => ({
      stopFunction: null,
      setStopFunction: (stopFunc) => set({ stopFunction: stopFunc }),
      clearStopFunction: () => set({ stopFunction: null }),
    }),
    {
      name: 'utils',
      version: 1,
    },
  ),
)
