import { Flip, toast } from 'react-toastify'

export const useToast = () => {
  const toastError = (message: string) => {
    toast.error(message, {
      position: 'bottom-right',
      autoClose: 4000,
      theme: 'dark',
      transition: Flip,
      toastId: message,
    })
  }

  const toastSuccess = (message: string) => {
    toast.success(message, {
      position: 'bottom-right',
      autoClose: 2000,
      theme: 'dark',
      transition: Flip,
      toastId: message,
    })
  }

  return { toastError, toastSuccess }
}
