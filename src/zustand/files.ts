import type { PutBlobResult } from '@vercel/blob'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FilesState = {
  documents: PutBlobResult[]
  addDocuments: (newDocuments: PutBlobResult[]) => void
  removeDocument: (pathName: string) => void
}

export const useFilesStore = create<FilesState>()(
  persist(
    (set, get) => ({
      documents: [],
      addDocuments: (newDocuments) =>
        set({
          documents: [...get().documents, ...newDocuments],
        }),
      removeDocument: (url: string) =>
        set({
          documents: get().documents.filter((doc) => doc.url !== url),
        }),
    }),
    {
      name: 'files',
    },
  ),
)
