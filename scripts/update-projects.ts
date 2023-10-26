import * as csv from 'fast-csv'
import { createReadStream, existsSync, mkdir } from 'node:fs'
import path from 'node:path'
import { AdapterProject, projects } from '../projects'
import fs from 'node:fs/promises'
import { AdapterProjectCategory, AdapterProjectChain, AdapterProjectToken } from '../projects/types'

const projectToFileName = (project: AdapterProject) =>
  project.name.trim().toLowerCase().replaceAll(' ', '-').replaceAll('.', '-')

let index = 0
let parsedProjects: AdapterProject[] = []
createReadStream(path.resolve(__dirname, 'data/DePIN-Projects.csv'))
  .pipe(csv.parse())
  .on('error', (error) => console.error(error))
  .on('data', async (row: string[]) => {
    index++
    // ignore rows 1
    if (index === 1) return

    // ignore projects without id
    if (!row[1]) return

    const projectName = row[0]
    const existingProject = projects.find((p) => p.id === row[1])

    const project: AdapterProject = {
      name: projectName,
      chain: !!row[3] ? (row[3] as AdapterProjectChain) : null,
      category: row[2] as AdapterProjectCategory,
      token: !!row[6] ? (row[6] as AdapterProjectToken) : null,
      coingeckoId: !!row[5] ? row[5] : null,
      id: row[1],
      cmcId: !!row[4] ? +row[4] : null,

      description: row[7],
      investors: existingProject?.investors ?? [],
    }

    parsedProjects.push(project)
  })
  .on('end', async () => {
    const storedProjects: AdapterProject[] = []
    await Promise.all(
      parsedProjects.map(async (project) => {
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
            `There was a problem generating the project ${project.name} with data ${JSON.stringify(
              project
            )}`,
            error
          )
        }
      })
    )
  })
