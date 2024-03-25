import * as csv from 'fast-csv'
import { createReadStream, existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { investorToFileName, investorToVarName } from '../helpers'
import { AdapterInvestor } from '../investors/types'
import { projects } from '../projects'
import { AdapterProject } from '../projects/types'

const projectsList: AdapterProject[] = Object.values(projects)

/** Loop over the projects investors csv to get the total number of invested projects for each investor. */
export function getInvestorsProjectsCount(): Promise<Map<string, number>> {
  let index = 0
  let projectsColumns: string[] = []
  const projectsInvestorsCsvRows: string[] = []
  const investorsProjectsCount = new Map<string, number>()
  return new Promise((resolve) => {
    createReadStream(path.resolve(__dirname, 'data/DePIN-Projects-Investors.csv'))
      .pipe(csv.parse())
      .on('error', (error) => console.error(error))
      .on('data', async (row: string[]) => {
        index++
        projectsInvestorsCsvRows.push(row.map((cell) => cell.replaceAll('"', `\"`)).join(','))
        if (index === 1) return
        if (index === 2) {
          projectsColumns = row.slice(2, row.length)
          return
        }

        const investorProjects = row
          .slice(2, row.length)
          .map((active, idx) => {
            if (active === '1')
              return projectsList.find((project) => project.id === projectsColumns[idx])
            return null
          })
          .filter(Boolean)
          // Exclude projects that are not depin
          .filter((p) => p?.category !== 'NOT_DEPIN')

        investorsProjectsCount.set(row[1], investorProjects.length)
      })
      .on('end', async () => {
        // Update projects investors csv constants used to create/update csv rows programmatically.
        await fs.writeFile(
          `./helpers/constants.ts`,
          `/** This file is auto generated don't edit manually. */
          \nexport const projectsInvestorsCsv = ${JSON.stringify(projectsInvestorsCsvRows)}`
        )

        resolve(investorsProjectsCount)
      })
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
