import { customAlphabet } from 'nanoid'
import { AdapterProject } from '../projects/types'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'

// Creates a function that generates a short ID of specified length.
export function createNewId(
  size: number = 6
): (unique: boolean, projects: AdapterProject[]) => Promise<string> {
  const generateId = customAlphabet(alphabet, size)

  return async function newId(unique = true, projects = []) {
    let id = await generateId()

    // Ensures that the generated ID is unique
    while (unique) {
      const record = projects.find((p) => p.id === id)

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
