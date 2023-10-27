import { createNewId } from './utils'
import { projects } from '../projects'

createNewId()(true, projects).then((id) =>
  console.info(`You can use the following id for your project: "${id}"`)
)
