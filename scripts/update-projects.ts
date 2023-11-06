import * as csv from 'fast-csv'
import { createReadStream, existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { projectToFileName, projectToVarName } from '../helpers'
import { AdapterProject } from '../projects'
import { AdapterProjectCategory, AdapterProjectChain, AdapterProjectToken } from '../projects/types'

/** Loop over the projects investors csv to get investors for each project. */
export function getProjectsInvestors(): Promise<Map<string, string[]>> {
  let index = 0
  let investorsIds: string[] = []
  const projectsInvestors = new Map<string, string[]>()

  return new Promise((resolve) => {
    createReadStream(path.resolve(__dirname, 'data/DePIN-Projects-Investors.csv'))
      .pipe(csv.parse())
      .on('error', (error) => console.error(error))
      .on('data', async (row: string[]) => {
        index++
        if (index === 1) {
          investorsIds = row.slice(3, row.length)
          return
        }

        // ignore rows 2 and 3
        if (index === 2 || index === 3) return
        const projectId = row[1]
        const investors = row
          .slice(3, row.length)
          .map((value, idx) => (Boolean(value) ? investorsIds[idx] : undefined))
          .filter(Boolean)

        projectsInvestors.set(projectId, investors as string[])
      })
      .on('end', () => resolve(projectsInvestors))
  })
}

type ProjectsCsvRow = {
  name: string
  id: string
  url: string
  category: string
  chain: string
  token: string
  coinGeckoID: string
  cmcSlug: string
  description: string
  subcategories: string
  twitter: string
  discord: string
  telegram: string
  blog: string
  github: string
  linkedin: string
}

async function run() {
  let parsedProjects: AdapterProject[] = []
  const projectsInvestors = await getProjectsInvestors()

  createReadStream(path.resolve(__dirname, 'data/DePIN-Projects.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', (error) => console.error(error))
    .on('data', async (row: ProjectsCsvRow) => {
      const projectId = row.id
      // ignore projects without id
      if (!projectId) {
        console.warn(`[update-projects] ignoring row \n${row}\nBecause there's no project id.`)
        return
      }

      const project: AdapterProject = {
        name: row.name,
        chain: !!row.chain ? (row.chain as AdapterProjectChain) : null,
        category: !!row.category ? (row.category as AdapterProjectCategory) : 'OTHER',
        token: !!row.token ? (row.token as AdapterProjectToken) : null,
        coingeckoId: !!row.coinGeckoID ? row.coinGeckoID : null,
        id: projectId,
        description: row.description,
        investors: projectsInvestors.get(projectId) ?? [],
        cmcSlug: !!row.cmcSlug ? row.cmcSlug : null,
      }
      parsedProjects.push(project)
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
