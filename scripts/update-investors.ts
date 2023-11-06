import * as csv from 'fast-csv'
import { createReadStream, existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { investorToFileName, investorToVarName } from '../helpers'
import { AdapterInvestor } from '../investors/types'

/** Loop over the projects investors csv to get the total number of invested projects for each investor. */
export function getInvestorsProjectsCount(): Promise<Map<string, number>> {
  let index = 0
  let investorsIds: string[] = []
  const investorsProjectsCount = new Map<string, number>()

  return new Promise((resolve) => {
    createReadStream(path.resolve(__dirname, 'data/DePIN-Projects-Investors.csv'))
      .pipe(csv.parse())
      .on('error', (error) => console.error(error))
      .on('data', async (row: string[]) => {
        index++

        if (index === 1) {
          investorsIds = row.slice(3, row.length)
          row.slice(3, row.length).forEach((investorId) => {
            investorsProjectsCount.set(investorId, 0)
          })
          return
        }

        // ignore rows 2 and 3
        if (index === 2 || index === 3) return

        row.slice(3, row.length).forEach((flag, idx) => {
          const isActive = Boolean(flag)
          if (isActive) {
            const investorId = investorsIds[idx]
            const currentValue = Number(investorsProjectsCount.get(investorId))
            investorsProjectsCount.set(investorId, currentValue + 1)
          }
        })
      })
      .on('end', () => resolve(investorsProjectsCount))
  })
}

/** Loop over the investors csv and updates investors .ts files. */
async function run() {
  let index = 0
  let investors: AdapterInvestor[] = []
  const investorsProjectsCount = await getInvestorsProjectsCount()

  createReadStream(path.resolve(__dirname, 'data/DePIN-Investors.csv'))
    .pipe(csv.parse())
    .on('error', (error) => console.error(error))
    .on('data', async (row: string[]) => {
      index++

      // ignore row with headers
      if (index === 1) return

      const investor: AdapterInvestor = {
        id: row[1],
        name: row[0],
        investedProjectsCount: investorsProjectsCount.get(row[1]) ?? 0,
      }

      investors.push(investor)
    })
    .on('end', async () => {
      const storedInvestors: AdapterInvestor[] = []
      await Promise.all(
        investors.map(async (investor) => {
          const investorFileName = investorToFileName(investor.name)
          if (!existsSync(`./investors/${investorFileName}`)) {
            await fs.mkdir(`./investors/${investorFileName}`)
          }
          await fs.writeFile(
            `./investors/${investorFileName}/index.ts`,
            `import { AdapterInvestor } from '../types'\n\nexport default ${JSON.stringify(
              investor,
              null,
              2
            )} satisfies AdapterInvestor`
          )
          storedInvestors.push(investor)
        })
      )

      storedInvestors.sort((a, b) => a.name.localeCompare(b.name))

      await fs.writeFile(
        './investors/index.ts',
        `${storedInvestors.map(
          (p) => `import ${investorToVarName(p.name)} from './${investorToFileName(p.name)}'`
        )}`.replaceAll(',', '\n') +
          `\n\nexport const investors = {${storedInvestors.map(
            (p) => `${investorToVarName(p.name)}`
          )}}\n\nexport { AdapterInvestor } from './types'`
      )
      console.log('Successfully updated investors.')
    })
}

run()
