import * as csv from 'fast-csv'
import { createReadStream, existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import {
  AdapterProjectDuneCsvRow,
  AdaptersProjectCsvRow,
  projectToFileName,
  projectToVarName,
} from '../helpers'
import { AdapterProject } from '../projects'
import {
  AdapterProjectCategory,
  AdapterProjectChain,
  AdapterProjectDuneQueryIdentifiers,
} from '../projects/types'

/** Loop over the projects investors csv to get investors for each project. */
export function getProjectsInvestors(): Promise<Map<string, string[]>> {
  let index = 0
  let projectsIds: string[] = []
  const projectsInvestors = new Map<string, string[]>()

  return new Promise((resolve) => {
    createReadStream(path.resolve(__dirname, 'data/DePIN-Projects-Investors.csv'))
      .pipe(csv.parse())
      .on('error', (error) => console.error(error))
      .on('data', async (row: string[]) => {
        index++
        // ignore row 1
        if (index === 1) return

        if (index === 2) {
          projectsIds = row.slice(3, row.length)
          row.slice(3, row.length).forEach((projectId) => {
            projectsInvestors.set(projectId, [])
          })
          return
        }

        row.slice(3, row.length).forEach((flag, idx) => {
          const isActive = Boolean(flag)
          if (isActive) {
            const investorId = row[1]
            const projectId = projectsIds[idx]
            const currentValue = projectsInvestors.get(projectId) ?? []
            projectsInvestors.set(projectId, currentValue.concat(investorId))
          }
        })
      })
      .on('end', () => resolve(projectsInvestors))
  })
}

/** Loop over the projects dune csv to get dune queries ids for each project. */
export function getProjectsDuneQueries(): Promise<
  Map<string, AdapterProjectDuneQueryIdentifiers | null>
> {
  const projectsDuneQueries = new Map<string, AdapterProjectDuneQueryIdentifiers | null>()

  return new Promise((resolve) => {
    createReadStream(path.resolve(__dirname, 'data/DePIN-Projects-Dune.csv'))
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => console.error(error))
      .on('data', async (row: AdapterProjectDuneCsvRow) => {
        const queries: AdapterProjectDuneQueryIdentifiers = {}
        if (row.BURN) queries.BURN = row.BURN
        if (row.LOCKED_BALANCE) queries.LOCKED_BALANCE = row.LOCKED_BALANCE
        if (row.MINT) queries.MINT = row.MINT
        if (row.PRICE) queries.PRICE = row.PRICE
        if (row.REVENUE) queries.REVENUE = row.REVENUE
        if (row.NET_REVENUE) queries.NET_REVENUE = row.NET_REVENUE
        if (row.SUPPLY) queries.SUPPLY = row.SUPPLY
        if (row.TIME_SERIES) queries.TIME_SERIES = row.TIME_SERIES
        if (row.KEY_METRIC) queries.KEY_METRIC = row.KEY_METRIC
        if (row.NODE_NUMBER) queries.NODE_NUMBER = row.NODE_NUMBER

        projectsDuneQueries.set(row.id, Object.values(queries).length > 0 ? queries : null)
      })
      .on('end', () => resolve(projectsDuneQueries))
  })
}

async function run() {
  let parsedProjects: AdapterProject[] = []
  const projectsInvestors = await getProjectsInvestors()
  const projectsDuneQueries = await getProjectsDuneQueries()

  createReadStream(path.resolve(__dirname, 'data/DePIN-Projects.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', (error) => console.error(error))
    .on('data', async (row: AdaptersProjectCsvRow) => {
      const projectId = row.id
      // ignore projects without id
      if (!projectId) {
        console.warn(
          `[update-projects] ignoring row \n${JSON.stringify({
            row,
          })}\nBecause there's no project id.`
        )
        return
      }

      parsedProjects.push({
        name: row.name,
        ninja: !!row.ninja ? row.ninja : null,
        subcategories: !!row.subcategories ? row.subcategories : null,
        chain: !!row.chain ? (row.chain as AdapterProjectChain) : null,
        category: !!row.category ? (row.category as AdapterProjectCategory) : 'BLOCKCHAIN_INFRA',
        token: !!row.token ? row.token : null,
        coinGeckoID: !!row.coinGeckoID ? row.coinGeckoID : null,
        id: projectId,
        description: row.description,
        discord: !!row.discord ? row.discord : null,
        investors: projectsInvestors.get(projectId) ?? [],
        linkedin: !!row.linkedin ? row.linkedin : null,
        duneQueries: projectsDuneQueries.get(projectId) ?? null,
        foundingYear: !!row.foundingYear ? row.foundingYear : null,
        blog: !!row.blog ? row.blog : null,
        github: !!row.github ? row.github : null,
        telegram: !!row.telegram ? row.telegram : null,
        twitter: !!row.twitter ? row.twitter : null,
        url: !!row.url ? row.url : null,
        verified: Boolean(row.verified),
      })
    })
    .on('end', async () => {
      const storedProjects: AdapterProject[] = []

      await Promise.all(
        parsedProjects.map(async (project) => {
          try {
            const projectFileName = projectToFileName(project.name)

            if (!existsSync(`./projects/${projectFileName}`)) {
              await fs.mkdir(`./projects/${projectFileName}`)
            }
            await fs.writeFile(
              `./projects/${projectFileName}/index.ts`,
              `import { AdapterProject } from '../types'\n\nexport default ${JSON.stringify(
                project,
                null,
                2
              )} satisfies AdapterProject`
            )

            // if the project was successfully stored then we store it in the var names that will be exported by the package.
            storedProjects.push(project)
          } catch (error) {
            console.log(
              `There was a problem generating the project ${
                project.name
              } with data ${JSON.stringify(project)}`,
              error
            )
          }
        })
      )

      storedProjects.sort((a, b) => a.name.localeCompare(b.name))

      await fs.writeFile(
        './projects/index.ts',
        `${storedProjects.map(
          (p) => `import ${projectToVarName(p.name)} from './${projectToFileName(p.name)}'`
        )}`.replaceAll(',', '\n') +
          `\n\nexport const projects = {${storedProjects.map(
            (p) => `${projectToVarName(p.name)}`
          )}}\n\nexport { AdapterProject } from './types'`
      )

      console.log('Successfully updated projects.')
    })
}

run()
