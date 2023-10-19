import * as csv from 'fast-csv'
import { createReadStream } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { projects } from '../projects'

let index = 0
let investorsIds: string[] = []
const projectsInvestors = new Map()

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

    projectsInvestors.set(projectId, investors)
  })
  .on('end', async () => {
    let dirs = await fs.readdir(`./projects`)
    dirs = dirs.filter((dir) => dir !== 'index.ts' && dir !== 'types.ts')

    Promise.all(
      dirs.map(async (projectDir) => {
        const projectPath = `./projects/${projectDir}/index.ts`
        const data = await fs.readFile(projectPath, 'utf-8')
        const projectId = data.substring(data.indexOf("id: '") + 5, data.indexOf("id: '") + 11)
        const project = projects.find((p) => p.id === projectId)

        if (!project) {
          console.warn(
            `[WARN] Was not able to find the project with id ${projectId} at ${projectPath}`
          )
          return
        }

        const updatedProject = { ...project, investors: projectsInvestors.get(project.id) ?? [] }

        fs.writeFile(
          projectPath,
          `import { AdapterProject } from '../types'\n\nexport default ${JSON.stringify(
            updatedProject,
            null,
            2
          )} satisfies AdapterProject`
        )
      })
    )
  })
