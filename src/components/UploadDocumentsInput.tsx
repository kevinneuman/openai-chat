import type { PutBlobResult } from '@vercel/blob'
import type { ChangeEvent, FC } from 'react'
import React, { useRef, useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { FaFileUpload } from 'react-icons/fa'
import { useToast } from '@/hooks/useToast'
import { getMessageFromResponse } from '@/utils/helpers'
import { useFilesStore } from '@/zustand/files'
import { useSettingsStore } from '@/zustand/settings'

type UploadDocumentsInputProps = {
  files?: File[]
}

const UploadDocumentsInput: FC<UploadDocumentsInputProps> = () => {
  const [uploading, setUploading] = useState(false)
  const userId = useSettingsStore((state) => state.userId)
  const addDocuments = useFilesStore((state) => state.addDocuments)
  const blobToken = useSettingsStore((state) => state.blobToken)

  const { toastError } = useToast()

  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setUploading(true)
    const files = event.target.files

    if (files) {
      const formData = new FormData()

      formData.append('userId', userId)

      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
        formData.append('fileNames', files[i].name)
        formData.append('blobToken', blobToken)
      }

      try {
        const resp = await fetch('/api/put-file', {
          method: 'POST',
          body: formData,
        })

        if (!resp.ok) {
          throw await getMessageFromResponse(resp)
        }

        const uploadedFilesResult: PutBlobResult[] = await resp.json()

        addDocuments(uploadedFilesResult)
        setUploading(false)
      } catch (e) {
        console.error(e)
        toastError(e as string)
        setUploading(false)
      }
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".txt, .json, application/json"
        multiple
        className="hidden"
        onChange={handleChange}
      />
      <button
        aria-label="select files"
        className={'flex items-center justify-center p-4 rounded bg-green-500 text-white'}
        onClick={handleClick}
      >
        {uploading ? (
          <AiOutlineLoading className="text-xl animate-spin" />
        ) : (
          <FaFileUpload className="text-xl" />
        )}
      </button>
    </>
  )
}

export default UploadDocumentsInput
