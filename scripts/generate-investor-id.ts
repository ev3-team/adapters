import { generateInvestorId } from '../helpers'

generateInvestorId().then((id) =>
  console.info(`You can use the following id for the new investor: "${id}"`)
)
