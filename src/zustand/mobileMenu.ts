import { create } from 'zustand'

type MobileMenuState = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const useMobileMenuStore = create<MobileMenuState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}))
