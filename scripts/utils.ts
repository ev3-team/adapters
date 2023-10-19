import { customAlphabet } from 'nanoid'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'

// Creates a function that generates a short ID of specified length.
export function createNewId<T extends { id: string }>(
  size: number = 6
): (unique: boolean, records: T[]) => Promise<string> {
  const generateId = customAlphabet(alphabet, size)

  return async function newId(unique = true, records = []) {
    let id = await generateId()

    // Ensures that the generated ID is unique
    while (unique) {
      const record = records.find((p) => p.id === id)

      if (record) {
        console.warn(`Re-generating new project ID.`)
        id = await generateId()
      } else {
        break
      }
    }

    return id
  }
}
