export const isValidJson = (jsonString: string): boolean => {
  try {
    const json = JSON.parse(jsonString)
    return typeof json === 'object' && json !== null
  } catch (error) {
    return false
  }
}
