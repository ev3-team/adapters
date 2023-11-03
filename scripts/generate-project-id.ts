import { generateProjectId } from '../helpers'

generateProjectId().then((id) =>
  console.info(`You can use the following id for your project: "${id}"`)
)
