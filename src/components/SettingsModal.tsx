import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { FaUserCog } from 'react-icons/fa'
import Modal from './Modal'
import { useSettingsStore } from '@/zustand/settings'

export default function SettingsModal() {
  const previousRole = useSettingsStore((state) => state.role)
  const updateRole = useSettingsStore((state) => state.updateRole)
  const previousApiKey = useSettingsStore((state) => state.apiKey)
  const updateApiKey = useSettingsStore((state) => state.updateApiKey)
  const previousBlobToken = useSettingsStore((state) => state.blobToken)
  const updateBlobToken = useSettingsStore((state) => state.updateBlobToken)

  const [modalOpen, setModalOpen] = useState(false)
  const [role, setRole] = useState(previousRole)
  const [apiKey, setApiKey] = useState(previousApiKey)
  const [blobToken, setBlobToken] = useState(previousBlobToken)

  const handleOpenModal = () => setModalOpen(true)
  const handleCloseModal = () => setModalOpen(false)

  const handleChangeRole = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value
    setRole(newValue)
  }

  const handleChangeApiKey = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setApiKey(newValue)
  }

  const handleChangeBlobToken = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setBlobToken(newValue)
  }

  const handleCancel = () => {
    updateRole(previousRole)
    updateApiKey(previousApiKey)
    updateBlobToken(previousBlobToken)
    handleCloseModal()
  }

  const handleAccept = () => {
    updateRole(role.trim())
    updateApiKey(apiKey.trim())
    updateBlobToken(blobToken.trim())
    handleCloseModal()
  }

  return (
    <>
      <button
        aria-label="assign role"
        className="flex gap-2 items-center p-4 rounded bg-neutral-800 active:text-green-200"
        onClick={handleOpenModal}
      >
        <FaUserCog className={`text-xl ${previousRole && 'text-green-500'}`} />
      </button>
      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-200">
              Give bot a role
            </label>
            <label className="block mb-2 text-xs font-medium text-gray-500">
              Given role will affect all new chats from now on
            </label>
            <textarea
              id="message"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-200 bg-neutral-700  rounded-lg"
              placeholder="e.g., Study Buddy..."
              value={role}
              onChange={handleChangeRole}
            ></textarea>
          </div>
          <div>
            <label htmlFor="api-key" className="block mb-2 text-sm font-medium text-gray-200">
              OpenAI API key
            </label>
            <label className="block mb-2 text-xs font-medium text-gray-500">
              Not needed if OPENAI_API_KEY was provided through env
            </label>
            <label className="block mb-2 text-xs font-medium text-gray-500">
              Dont have one yet?
              <a
                className="ml-1 text-blue-500 hover:underline"
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get API key from OpenAI
              </a>
            </label>
            <input
              type="text"
              name="api-key"
              id="api-key"
              autoComplete="off"
              placeholder="Paste API key here"
              className="bg-neutral-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
              value={apiKey}
              onChange={handleChangeApiKey}
            />
          </div>
          <div>
            <label htmlFor="blob-token" className="block mb-2 text-sm font-medium text-gray-200">
              Vercel Blob token
            </label>
            <label className="block mb-2 text-xs font-medium text-gray-500">
              Not needed if BLOB_READ_WRITE_TOKEN was provided through env. This is only needed for
              Document query (RAG) -feature
            </label>
            <label className="block mb-2 text-xs font-medium text-gray-500">
              Dont have one yet?
              <a
                className="ml-1 text-blue-500 hover:underline"
                href="https://vercel.com/docs/storage/vercel-blob"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Blob token from Vercel
              </a>
            </label>
            <input
              type="text"
              name="blob-token"
              id="blob-token"
              autoComplete="off"
              placeholder="Paste Blob token here"
              className="bg-neutral-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
              value={blobToken}
              onChange={handleChangeBlobToken}
            />
          </div>
          <div className="flex flex-row mt-4 justify-end gap-2">
            <button
              type="button"
              className="text-white bg-neutral-800 hover:bg-neutral-900 font-medium rounded-lg text-sm px-5 py-2.5"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className=" text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5"
              onClick={handleAccept}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
