export const isValidJson = (jsonString: string): boolean => {
  try {
    const json = JSON.parse(jsonString)
    return typeof json === 'object' && json !== null
  } catch (error) {
    return false
  }
}

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

export const base64ToFile = async (base64: string, filename: string): Promise<File> => {
  const response = await fetch(base64)
  const blob = await response.blob()
  return new File([blob], filename, { type: blob.type })
}
