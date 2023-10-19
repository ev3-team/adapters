import { createNewId } from './utils'
import { investors } from '../investors'

createNewId()(true, investors).then((id) =>
  console.info(`You can use the following id for the new investor: "${id}"`)
)
