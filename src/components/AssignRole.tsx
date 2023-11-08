import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { FaUserCog } from 'react-icons/fa'
import Modal from '../components/Modal'
import { useRolesStore } from '@/zustand/roles'

export default function AssignRole() {
  const previousRole = useRolesStore((state) => state.role)
  const updateRole = useRolesStore((state) => state.updateRole)

  const [modalOpen, setModalOpen] = useState(false)
  const [role, setRole] = useState(previousRole)

  const handleOpenModal = () => setModalOpen(true)
  const handleCloseModal = () => setModalOpen(false)

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value
    setRole(newValue)
  }

  const handleCancel = () => {
    updateRole(previousRole)
    handleCloseModal()
  }

  const handleAccept = () => {
    updateRole(role)
    handleCloseModal()
  }

  return (
    <>
      <button
        aria-label="assign role"
        className="flex gap-2 items-center p-4 rounded bg-gray-800 active:text-green-200"
        onClick={handleOpenModal}
      >
        <FaUserCog className="text-xl" />
      </button>
      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Give bot a role
        </label>
        <label className="block mb-2 text-xs font-medium text-gray-500">
          Given role will affect all new chats from now on
        </label>
        <textarea
          id="message"
          rows={4}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="e.g., Study Buddy..."
          value={role}
          onChange={handleChange}
        ></textarea>
        <div className="flex flex-row mt-4 justify-end gap-2">
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5"
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
      </Modal>
    </>
  )
}
