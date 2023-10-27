import * as csv from 'fast-csv'
import { createReadStream, existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { AdapterProject } from '../projects'
import { AdapterProjectCategory, AdapterProjectChain, AdapterProjectToken } from '../projects/types'
import { getProjectCmcIdBySlug } from './utils'

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

const projectToFileName = (project: AdapterProject) =>
  project.name.trim().toLowerCase().replaceAll("'", '').replaceAll(' ', '-').replaceAll('.', '-')

const projectToVarName = (project: AdapterProject) =>
  project.name
    .trim()
    .toLowerCase()
    // unexpected characters
    .replaceAll('(', '')
    .replaceAll(')', '')
    .replaceAll('.', '')
    .replaceAll("'", '')
    .replaceAll('&', 'And')
    .replaceAll(' ', '-')
    .replace(/-([a-z,0-9,A-Z])/g, (g) => g[1].toUpperCase())
    // if the project name start with a number then add an underscore as prefix
    .replace(/^[0-9]/, (g) => `_${g}`)
    .concat(`${project.category[0]}${project.category.slice(1, project.category.length)}`)

type ParsedProject = Omit<AdapterProject, 'cmcId'> & { cmcSlug: string }

async function run() {
  let index = 0
  let parsedProjects: ParsedProject[] = []
  const projectsInvestors = await getProjectsInvestors()

  createReadStream(path.resolve(__dirname, 'data/DePIN-Projects.csv'))
    .pipe(csv.parse())
    .on('error', (error) => console.error(error))
    .on('data', async (row: string[]) => {
      index++
      // ignore rows 1
      if (index === 1) return
      const projectId = row[1]
      // ignore projects without id
      if (!projectId) {
        console.warn(`[update-projects] ignoring row \n${row}\nBecause there's no project id.`)
        return
      }

      const project: ParsedProject = {
        name: row[0],
        chain: !!row[3] ? (row[3] as AdapterProjectChain) : null,
        category: !!row[2] ? (row[2] as AdapterProjectCategory) : 'OTHER',
        token: !!row[6] ? (row[6] as AdapterProjectToken) : null,
        coingeckoId: !!row[5] ? row[5] : null,
        id: projectId,
        cmcSlug: row[4],
        description: row[7],
        investors: projectsInvestors.get(projectId) ?? [],
      }

      parsedProjects.push(project)
    })
    .on('end', async () => {
      const storedProjects: AdapterProject[] = []

      const cmcIds = await getProjectCmcIdBySlug(
        parsedProjects.map((pp) => pp.cmcSlug).filter(Boolean) as string[]
      )

      if (!cmcIds) {
        console.error('error getting cmc ids')
        return
      }
      await Promise.all(
        parsedProjects.map(async (pp) => {
          const { cmcSlug, ...p } = pp
          const project: AdapterProject = { ...p, cmcId: cmcIds.get(cmcSlug) ?? null }
          try {
            const projectFileName = projectToFileName(project)
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

      await fs.writeFile(
        './projects/index.ts',
        `${storedProjects.map(
          (p) => `import ${projectToVarName(p)} from './${projectToFileName(p)}'`
        )}`.replaceAll(',', '\n') +
          `\n\nexport const projects = [${storedProjects.map(
            (p) => `${projectToVarName(p)}`
          )}]\n\nexport { AdapterProject } from './types'`
      )
      console.log('Successfully updated projects.')
    })
}

run()
