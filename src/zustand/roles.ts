import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type RolesState = {
  role: string
  updateRole: (newRole: string) => void
}

export const useRolesStore = create<RolesState>()(
  persist(
    (set) => ({
      role: '',
      updateRole: (newRole) => set({ role: newRole }),
    }),
    {
      name: 'roles',
    },
  ),
)
